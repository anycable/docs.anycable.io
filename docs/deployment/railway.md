# Railway Deployment

The recommended way to deploy AnyCable apps to [Railway][railway] is to have two services within the same project: one with a Rails app and another one with `anycable-go` (backed by the official Docker image). AnyCable runs in [standalone mode](../anycable-go/getting_started.md) (no gRPC)—the Go server handles WebSocket connections, Turbo Streams verification, and pub/sub without calling back to Rails.

This approach uses Railway's [private networking][railway-private] for server-to-server communication (broadcasting) while exposing only the WebSocket endpoint publicly.

> You can also use the `rails g anycable:setup` generator to scaffold the configuration files described below. See [Getting started with Rails](../rails/getting_started.md).

## Prerequisites

Generate a secret shared between the Rails app and the AnyCable-Go server:

```sh
bin/rails secret
```

This single `ANYCABLE_SECRET` is used for JWT authentication, signed stream verification, and broadcast authorization.

## Deploying AnyCable-Go

Create a new service in your Railway project using the official Docker image. Both services **must be in the same Railway project** for private networking to work.

### Via Railway dashboard

1. Click **New** → **Docker Image** and enter `anycable/anycable-go:1.6`.
2. Add the environment variables listed [below](#anycable-go-environment-variables).
3. In **Settings** → **Networking**, expose port `8080` and generate a public domain (e.g., `my-cable.up.railway.app`).

### Via Railway CLI

```sh
railway link
railway add --service anycable --image anycable/anycable-go:1.6
railway service link anycable

railway variable set \
  ANYCABLE_SECRET=<secret> \
  ANYCABLE_PRESETS=broker \
  ANYCABLE_BROADCAST_ADAPTERS=http \
  ANYCABLE_STREAMS_TURBO=true \
  ANYCABLE_RPC_IMPL=none
```

### AnyCable-Go environment variables

```sh
# Shared secret (must match the Rails app)
ANYCABLE_SECRET=<secret>

# Standalone mode: no gRPC, Turbo Streams verified at the Go server
ANYCABLE_RPC_IMPL=none
ANYCABLE_STREAMS_TURBO=true

# Enable broker for reliable streams, presence, and history
ANYCABLE_PRESETS=broker

# HTTP broadcasting (Rails pushes messages here)
ANYCABLE_BROADCAST_ADAPTERS=http
```

**IMPORTANT:** Do not use `anycable/anycable-go:latest`—it may point to an older version that lacks features like [presence](../anycable-go/presence.md) and [reliable streams](../anycable-go/reliable_streams.md) (added in v1.6). Always pin to a specific major.minor tag.

**NOTE:** For multi-instance deployments, add `ANYCABLE_PUBSUB_ADAPTER=nats` to enable [embedded NATS](../anycable-go/embedded_nats.md) for inter-node communication.

If you plan to use [presence](../anycable-go/presence.md), the `broker` preset enables it automatically. You can tune the TTL with `ANYCABLE_PRESENCE_TTL=30`.

## Configuring the Rails app

### Gem

Add the `anycable-rails` gem:

```ruby
# Gemfile
gem "anycable-rails", "~> 1.5"
```

```sh
bundle install
```

### Cable adapter

Use `any_cable` for all environments:

```yml
# config/cable.yml
development:
  adapter: any_cable

test:
  adapter: test

production:
  adapter: any_cable
```

### AnyCable configuration

This file configures the **Rails side** of AnyCable (not the Go server). In development, it uses a local secret matching your `anycable.toml`. In production, secrets come from environment variables or Rails credentials.

```yml
# config/anycable.yml
default: &default
  broadcast_adapter: http
  secret: "anycable-local-secret"
  websocket_url: "ws://localhost:8080/cable"

development:
  <<: *default

test:
  <<: *default

production:
  <<: *default
  # Loaded from ANYCABLE_SECRET env var or Rails credentials
  secret: ~
  # Loaded from ANYCABLE_WEBSOCKET_URL env var
  websocket_url: ~
```

The `secret` must match between the Rails app and the AnyCable-Go server. In production, set `ANYCABLE_SECRET` as an environment variable on both services (or store it in Rails credentials under `anycable.secret`).

### Turbo Streams verifier key

Add this line to your application config so Turbo Streams signed names are verified using the AnyCable secret (enabling [standalone Turbo verification](../anycable-go/signed_streams.md) at the Go server):

```ruby
# config/application.rb
config.turbo.signed_stream_verifier_key = AnyCable.config.secret
```

No initializer or `after_initialize` wrapper needed—`AnyCable.config` is available at application boot via `anyway_config`.

### Production environment

```ruby
# config/environments/production.rb
if ENV["ANYCABLE_URL"].present?
  config.action_cable.mount_path = nil
  config.action_cable.url = ENV["ANYCABLE_URL"]
end
```

Setting `mount_path = nil` tells Rails not to handle WebSocket connections—AnyCable-Go takes over.

### Rails environment variables

Add the following to your **Rails** service on Railway:

```sh
railway service link my-app

railway variable set \
  ANYCABLE_URL=wss://my-cable.up.railway.app/cable \
  ANYCABLE_SECRET=<secret> \
  ANYCABLE_HTTP_BROADCAST_URL=http://my-cable.railway.internal:8080/_broadcast
```

**IMPORTANT:** These are two different URLs serving different purposes:

- `ANYCABLE_URL` is **public**—it goes into the HTML `<meta>` tag so the browser JS client knows where to open a WebSocket connection. Use your Railway public domain with `wss://`.
- `ANYCABLE_HTTP_BROADCAST_URL` is **private**—Rails uses it to push broadcast messages to AnyCable-Go over Railway's internal network. Use the `*.railway.internal` hostname with `http://` on port `8080`.

Replace `my-cable` with your actual AnyCable-Go service name in Railway.

> You can use Railway's [shared variables](https://docs.railway.com/guides/variables#shared-variables) to avoid duplicating `ANYCABLE_SECRET` between services.

## Authentication

Since the Rails app and AnyCable-Go run on separate Railway domains, browsers won't share cookies between them. Use [JWT identification][jwt-id] instead.

The `anycable-rails` gem provides a helper that generates a signed JWT and embeds it in a `<meta>` tag:

```erb
<%# In your layout (replaces action_cable_meta_tag) %>
<%= action_cable_with_jwt_meta_tag(current_user: current_user.id) %>
```

The AnyCable JS client picks up the token from the meta tag automatically. AnyCable-Go verifies it using the shared `ANYCABLE_SECRET`.

> If you put both services behind the same custom domain (so cookies are shared), you can keep session-based authentication without JWT. Make sure to configure your session cookie with `domain: :all`. See also [Authentication](../rails/authentication.md).

In standalone mode (`rpc.implementation = "none"`), there is no `connection.rb` callback—AnyCable-Go handles connection authentication via JWT directly. If you use custom Action Cable channel classes that need server-side authorization, switch to [HTTP RPC mode](../ruby/http_rpc.md) instead.

## Client-side JavaScript

Replace the default Action Cable JS client with the AnyCable client. Existing `turbo_stream_from` subscriptions and `broadcast_*` calls in your models and jobs require **no changes**.

### With importmap-rails

Vendor the AnyCable packages and `@hotwired/turbo` (the real Turbo package, not the `turbo-rails` bundle):

```sh
bin/importmap pin @anycable/web @anycable/core @anycable/turbo-stream @hotwired/turbo nanoevents --download
```

If `bin/importmap pin` can't find the packages, download them manually:

```sh
curl -o vendor/javascript/@anycable--web.js "https://ga.jspm.io/npm:@anycable/web@1.0.0/index.js"
curl -o vendor/javascript/@anycable--core.js "https://ga.jspm.io/npm:@anycable/core@1.0.0/index.js"
curl -o vendor/javascript/@anycable--turbo-stream.js "https://ga.jspm.io/npm:@anycable/turbo-stream@0.8.1/index.js"
curl -o vendor/javascript/nanoevents.js "https://ga.jspm.io/npm:nanoevents@9.1.0/index.js"
```

You also need the real `@hotwired/turbo` package (not the `turbo-rails` bundle). Download it from npm or copy from the [anycable_rails_demo](https://github.com/anycable/anycable_rails_demo).

Then pin them in your import map:

```ruby
# config/importmap.rb
pin "@hotwired/turbo", to: "@hotwired--turbo.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
# ...

pin "@anycable/web", to: "@anycable--web.js"
pin "@anycable/core", to: "@anycable--core.js"
pin "@anycable/turbo-stream", to: "@anycable--turbo-stream.js"
pin "nanoevents"
```

**IMPORTANT:** Use `@hotwired/turbo` (the real package), not `@hotwired/turbo-rails`. The `turbo-rails` bundle (`turbo.min.js`) does not export `connectStreamSource` as a named export, which causes a silent `SyntaxError` that kills all JavaScript on the page. Remove the `@hotwired/turbo-rails` and `@rails/actioncable` pins.

### With jsbundling-rails (esbuild, webpack, rollup)

Install the packages directly:

```sh
npm install @anycable/web @anycable/turbo-stream
```

No vendoring needed—the bundler resolves imports automatically.

### JavaScript entrypoint

```js
// app/javascript/application.js
import "@hotwired/turbo"
import { createCable } from "@anycable/web"
import { start } from "@anycable/turbo-stream"

const cable = createCable({ protocol: "actioncable-v1-ext-json" })
start(cable, { requestSocketIDHeader: true })

// ...rest of your imports (Stimulus controllers, etc.)
```

See [@anycable/turbo-stream](https://github.com/anycable/anycable-client/tree/master/packages/turbo-stream) for more details.

**IMPORTANT:** After switching the JS client, run your **system tests** (`bin/rails test:system`), not just unit/integration tests. If any import fails to resolve, the entire `application.js` module fails silently—Stimulus controllers and Turbo stop working.

## Local development

AnyCable-Go runs locally during development too, so behavior matches production. The `rails g anycable:setup` generator creates a `bin/anycable-go` script that auto-downloads the binary:

```sh
# bin/anycable-go
#!/bin/bash
cd $(dirname $0)/..

version="latest"

if [ ! -f ./bin/dist/anycable-go ]; then
  ./bin/rails g anycable:download --version=$version --bin-path=./bin/dist
fi

./bin/dist/anycable-go $@
```

Add it to your `Procfile.dev`:

```
web: bin/rails server
css: bin/rails tailwindcss:watch
ws: bin/anycable-go --port 8080
```

The local AnyCable-Go server reads `anycable.toml` from the project root:

```toml
# anycable.toml
secret = "anycable-local-secret"
presets = ["broker"]
broadcast_adapters = ["http"]

[rpc]
implementation = "none"

[streams]
turbo = true
whisper = true

[logging]
debug = true
```

The `secret` must match the value in `config/anycable.yml`. In production, the `ANYCABLE_SECRET` environment variable overrides both.

## Content Security Policy

If your Rails app sets a Content Security Policy, add the AnyCable-Go WebSocket origin to the `connect-src` directive:

```ruby
# config/initializers/content_security_policy.rb
Rails.application.configure do
  config.content_security_policy do |policy|
    anycable_origin = if (url = ENV["ANYCABLE_URL"].presence)
      uri = URI.parse(url)
      "#{uri.scheme}://#{uri.host}#{":#{uri.port}" unless [80, 443].include?(uri.port)}"
    end

    policy.connect_src :self, *[anycable_origin].compact
  end
end
```

## Presence

AnyCable presence + Hotwire lets you show who's viewing a page with zero custom JavaScript. Enable presence in your JS entrypoint:

```js
const cable = createCable({ protocol: "actioncable-v1-ext-json" })
start(cable, { requestSocketIDHeader: true, presence: true })
```

Then drop this into any template (or your layout for site-wide presence):

```erb
<turbo-cable-presence-source
  signed-stream-name="<%= Turbo::StreamsChannel.signed_stream_name(["presence", request.path]) %>"
  presence-id="<%= dom_id(current_user, :presence) %>">
  <div style="display: flex; align-items: center; gap: 4px;">
    <div style="display: flex; flex-direction: row-reverse;" id="presence-avatars"></div>
    <span data-presence-counter>0</span> online
  </div>
  <template>
    <%= turbo_stream.append "presence-avatars" do %>
      <div id="<%= dom_id(current_user, :presence) %>">
        <%= current_user.name %>
      </div>
    <% end %>
  </template>
</turbo-cable-presence-source>
```

See the [presence documentation](../anycable-go/presence.md) for more details.

## Scaling

Railway assigns a private DNS name to each service (`<service-name>.railway.internal`). This is used for HTTP broadcasting from Rails to AnyCable-Go.

To scale WebSocket capacity, increase the number of AnyCable-Go instances in Railway. For multi-instance deployments, add a pub/sub adapter for inter-node communication:

```sh
ANYCABLE_PUBSUB_ADAPTER=nats
```

See [embedded NATS](../anycable-go/embedded_nats.md) for details on running NATS within AnyCable-Go without a separate NATS server.

## Verifying the deployment

After deploying both services, open your Rails app and check the browser DevTools:

- **Network tab:** Filter by "WS". You should see a connection to `wss://my-cable.up.railway.app/cable` with status 101. Click it to inspect frames—the first message should be `{"type":"welcome"}`.
- **Console tab:** A healthy connection shows `[AnyCable] Connected to wss://...`. Errors to look for:
  - `WebSocket connection failed` — AnyCable-Go is not reachable or the domain is wrong.
  - `Refused to connect... Content Security Policy` — CSP needs the AnyCable-Go origin (see [CSP](#content-security-policy)).
  - `{"type":"disconnect","reason":"unauthorized"}` — `ANYCABLE_SECRET` doesn't match between services.

Test a broadcast from the Rails console:

```ruby
Turbo::StreamsChannel.broadcast_refresh_to("test")
```

Check AnyCable-Go logs via CLI (`railway service link anycable && railway logs`) or in the Railway dashboard.

If broadcasts aren't delivered, check:

1. Both services have the **same** `ANYCABLE_SECRET` value.
2. `ANYCABLE_HTTP_BROADCAST_URL` uses the `*.railway.internal` hostname (private network), not the public domain.
3. `config.turbo.signed_stream_verifier_key` is set to `AnyCable.config.secret` in `config/application.rb`.
4. The broadcast URL port is `8080` (AnyCable-Go serves both WebSocket and HTTP broadcast on the same port).

[railway]: https://railway.app
[railway-private]: https://docs.railway.com/reference/private-networking
[jwt-id]: /anycable-go/jwt_identification
