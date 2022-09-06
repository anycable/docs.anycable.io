# Fly.io Deployment

> 🎥 Check out this [AnyCasts episode](https://anycable.io/blog/anycasts-rails-7-hotwire-and-anycable/) to learn how to deploy AnyCable applications to [Fly.io][fly]

The recommended way to deploy AnyCable apps to [Fly.io][fly] is to have two applications: one with a Rails app and another one with `anycable-go` (backed by the official Docker image).

## Deploying Rails app

Follow the [official documentation][fly-docs-rails] on how to deploy a Rails app.

Then, we need to configure AnyCable broadcast adapter. Check out the [official docs][fly-docs-redis] on how to create a Redis instance. **Don't forget to add `REDIS_URL` to your app's secrets**

Finally, we need to add an AnyCable RPC server. We can do that either by defining a separate process or by embedding it into a Rails web server.

### Standalone RPC process

You can define multiple processes in your `fly.toml` like this:

```toml
[processes]
  web = "bundle exec puma" # or whatever command you use to run a web server
  worker = "bundle exec anycable"
```

Don't forget to update the `services` definition:

```diff
  [[services]]
-   processes = ["app"]
+   processes = ["web"]
```

### Embedded RPC

You can run RPC server along with the Rails web server by using the embedded mode. Just add the following to your configuration:

```toml
[env]
  # ...
  ANYCABLE_EMBEDDED = "true"
```

Embedding the RPC server could help to reduce the overall RAM usage (since there is a single Ruby process), but would increase the GVL contention (since more threads would compete for Ruby VM).

### RPC configuration

To make RPC accessible from other applications, you must add the following env variable:

```toml
[env]
  ANYCABLE_RPC_HOST = "0.0.0.0:50051"
```

Also, since we rely on [client-side load balancing](./load_balancing.md), it worths adding a max live time for gRPC connections. In your `anycable.yml`:

```yml
production:
  # ...
  server_args:
    max_connection_age_ms: 60000
```

## Deploying AnyCable-Go

To deploy AnyCable-Go server, create a new app first:

```sh
fly apps create
```

Then, create a separate configuration file, `fly.anycable.toml`:

```toml
app = "cable" # use the name you chose on creation
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[build]
  image = "anycable/anycable-go:1"

[env]
  PORT = "8080"
  ANYCABLE_HOST = "0.0.0.0"

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    # IMPORTANT: Specify concurrency limits
    hard_limit = 10000
    soft_limit = 10000
    type = "connections"

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

Now you can run `fly deploy --config fly.anycable.toml` to deploy your AnyCable-Go server.

## Linking Rails and anycable-go apps

Finally, we need to _connect_ both parts to each other.

At the Rails app side, we need to provide the URL of our WebSocket server. For example:

```toml
[env]
  # ...
  CABLE_URL = "my-cable.fly.dev"
```

And in your `production.rb` (added automatically if you used `rails g anycable:setup`):

```ruby
Rails.application.configure do
  # Specify AnyCable WebSocket server URL to use by JS client
  config.after_initialize do
    config.action_cable.url = ActionCable.server.config.url = ENV.fetch("CABLE_URL", "/cable") if AnyCable::Rails.enabled?
  end
end
```

At the AnyCable-Go side (`fly.anycable.toml`), add the RPC host to the env variables:

```toml
[env]
  # ...
  ANYCABLE_RPC_HOST="dns:///lhr.my-app.internal:50051"
```

[fly]: https://fly.io
[fly-docs-rails]: https://fly.io/docs/rails/
[fly-docs-redis]: https://fly.io/docs/reference/redis/
