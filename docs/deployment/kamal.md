# Kamal

[Kamal](https://kamal-deploy.org/) is a deployment tool from Basecamp that makes it easy to deploy Rails applications with Docker. This guide covers different approaches to deploying AnyCable web server and RPC servers (if required) with Kamal 2.

**NOTE:** This guide assumes that the primary application framework is Ruby on Rails. However, most ideas could be applied to other frameworks and stacks.

There is a number of ways you can run AnyCable with Kamal depending on your needs. Here is the table describing recommended setups based on such factors as expected load, the number of servers (machines), whether you need an RPC server or not:

| Setup | Load | Servers | RPC | Recommended Approach |
|-------|------|---------|--------------|---------------------|
| Small | Low | 1 | No | Anycable Thruster |
| Small | Low | 1 | Yes | AnyCable Thruster + Embedded gRPC or HTTP RPC |
| Small | Medium | 1 | Yes | AnyCable Thruster + RPC role |
| Medium | Medium | 1-2 | No | AnyCable accessory (single server) |
| Medium | Medium | 1-2 | Yes | AnyCable accessory (single server) + RPC role (each server) |
| Large | High | 3+ | No | AnyCable accessory (many servers) + Redis/NATS |
| Large | High | 3+ | Yes | AnyCable accessory (many servers) + Redis/NATS + RPC role (each server) |

## Deploying AnyCable server

### Using Thruster

The simplest way to deploy AnyCable with Kamal is using the [anycable-thruster](https://github.com/anycable/thruster) gem, which allows you to run AnyCable alongside your Rails web server in a single container.

Rails' default Dockerfile already uses Thruster as its proxy server, so no additional changes required.

With this setup, we recommend getting started with an [embedded gRPC server](/rails/getting_started?id=embedded-grpc-server) or [HTTP RPC](https://docs.anycable.io/ruby/http_rpc), so you can keep the Kamal configuration untouched.

### Deploying AnyCable as an Accessory

For applications that need more control or better resource isolation, you can deploy AnyCable server separately as a Kamal _accessory_. With this approach, running `kamal setup` should be sufficient to make AnyCable server up and running.

One particular benefit AnyCable benefit this approach brings is **zero-disconnect deployments** (WebSocket connections are kept between application restarts).

However, there is a trade-off of having to use a separate domain name for AnyCable server (e.g., `ws.myapp.whatever`). That might require taking additional care of authentication (e.g., cookie-sharing). We recommend using AnyCable's built-in [JWT authentication](/anycable-go/jwt_identification) to not worry about that.

> See this [demo PR](https://github.com/anycable/anycable_rails_demo/pull/37) for a complete configuration example.

Here is a `config/deploy.yml` example with the AnyCable accessory:

```yaml
# ...

accessories:
  # ...
  anycable-go:
    image: anycable/anycable-go:1.6
    host: 192.168.0.1
    proxy:
      host: ws.demo.anycable.io
      ssl: true
      app_port: 8080
      healthcheck:
        path: /health
    env:
      clear:
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: 8080
        ANYCABLE_BROADCAST_ADAPTER: http
        ANYCABLE_HTTP_BROADCAST_PORT: 8080
      secret:
        - ANYCABLE_SECRET
```

The important bits are:

- `proxy` configuration for `anycable` accessory; it's required to server incoming traffic via Kamal

- we configure AnyCable to receive broadcast HTTP requests on the same port served by Kamal Proxy to avoid publishing any additional ports; specifying `ANYCABLE_SECRET` is required to ensure your HTTP broadcasting endpoint is secured.

The example above uses HTTP broadcasting. If you want to use Redis, it will look as follows:

```yaml
# Name of your service defines accessory service names
service: anycable_rails_demo

# ...

accessories:
  # ...
  redis:
    image: redis:7.0
    host: 192.168.0.1
    directories:
      - data:/data
  anycable-go:
    image: anycable/anycable-go:1.6
    host: 192.168.0.1
    proxy:
      host: ws.demo.anycable.io
      ssl: true
      app_port: 8080
      healthcheck:
        path: /health
    env:
      clear:
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: 8080
        ANYCABLE_REDIS_URL: "redis://anycable_rails_demo-redis:6379/0"
```

Note that if you want to run AnyCable servers on multiple hosts and use Redis for pub/sub, you must provide the same static Redis address for all AnyCable accessories (and better protect it at least via a password):

```yaml
accessories:
  # ...
  redis:
    host: <%= ENV.fetch('REDIS_HOST') %>
    image: redis:8.0-alpine
    port: "6379:6379"
    cmd: redis-server --requirepass <%= ENV.fetch("REDIS_PASSWORD") %>
    volumes:
      - redisdata:/data
  anycable-go:
    image: anycable/anycable-go:1.6
    host: <%= ENV.fetch("ANYCABLE_HOST") %>
    proxy:
      # ..
    env:
      clear:
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: 8080
        ANYCABLE_REDIS_URL: "redis://:<%= ENV.fetch("REDIS_PASSWORD") %>@<%= ENV.fetch("REDIS_HOST") %>:6379/0"
```

The example above assumes that we store various configuration parameters such as IP addresses in the `.env` file (so, the actual configuration is _parameterized_). See the full example [here](https://github.com/anycable/anycable_rails_demo/pull/39).

#### Using Embedded NATS

AnyCable can run with an embedded NATS server, eliminating the need for Redis:

```yaml
accessories:
  # ...
  anycable-go:
    host: <%= ENV.fetch("ANYCABLE_HOST") %>
    image: anycable/anycable-go:1.6.2-alpine
    env:
      clear:
        <<: *default_env
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: "8080"
        ANYCABLE_EMBED_NATS: "true"
        ANYCABLE_PUBSUB: nats
        ANYCABLE_BROADCAST_ADAPTER: "http"
        ANYCABLE_HTTP_BROADCAST_PORT: 8080
        ANYCABLE_ENATS_ADDR: "nats://0.0.0.0:4242"
        ANYCABLE_ENATS_CLUSTER: "nats://0.0.0.0:4243"
      secret:
        - ANYCABLE_SECRET
    options:
      publish:
        - "4242:4242"
        - "4243:4243"
    proxy:
      host: <%= ENV.fetch("WS_PROXY_HOST") %>
      ssl: true
      app_port: 8080
      healthcheck:
        path: /health
        interval: 1
        timeout: 5
```

The complete example of deploying AnyCable with embedded NATS via Kamal can be found in [this PR](https://github.com/anycable/anycasts_demo/pull/19).

## Deploying gRPC servers

AnyCable RPC server using gRPC transport should be deployed as separate _server role_ (not an accessory), since it serves your application. Thus, you must add to the list of servers as follows:

```yaml
service: anycable_rails_demo

servers:
  web:
    - 192.168.0.1

  anycable-rpc:
    hosts:
      - 192.168.0.1
    cmd: bundle exec anycable
    proxy: false
    options:
      network-alias: anycable_rails_demo-rpc

accessories:
  # ...
  anycable-go:
    # ...
    env:
      clear:
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: 8080
        ANYCABLE_RPC_HOST: anycable_rails_demo-rpc:50051
      secret:
        - ANYCABLE_SECRET
```

The important bits are:

- `proxy: false` is required to skip Kamal Proxy (it doesn't support gRPC)

- `network-alias: anycable_rails_demo-rpc` allows us to use an fixed Docker service name to access the RPC server container from the accessory.

### Scaling gRPC servers horizontally

> See this [demo PR](https://github.com/anycable/anycable_rails_demo/pull/39) for a complete configuration example.

AnyCable-Go 1.6.2+ supports the `grpc-list://` scheme to connect to multiple RPC endpoints. This way, you can spread RPC traffic across machines:

```yaml
# ...
servers:
  web:
    # ...

  rpc:
    hosts: <%= ENV.fetch("RPC_HOSTS").split(",") %>
    cmd: bundle exec anycable
    env:
      clear:
        <<: *default_env
        ANYCABLE_RPC_HOST: "0.0.0.0:50051"
    options:
      publish:
        - "50051:50051"
    proxy: false

accessories:
  # ...
  anycable-go:
    host: <%= ENV.fetch("WS_HOSTS") %>
    image: anycable/anycable-go:1.6.2-alpine
    env:
      clear:
        <<: *default_env
        ANYCABLE_HOST: "0.0.0.0"
        ANYCABLE_PORT: "8080"
        # Using a fixed list of RPC addresses https://docs.anycable.io/deployment/load_balancing?id=using-a-fixed-list-of-rpc-addresses
        ANYCABLE_RPC_HOST: "grpc-list://<%= ENV.fetch("RPC_HOSTS").split(",").map { "#{_1}:50051" }.join(",") %>"
    proxy:
      # ...
```

**IMPORTANT**: The setup above expose the gRPC server to the public (so it's reachable from other machines). We recommend securing access either by setting up firewall rules / virtual network within the cluster or using TLS with a private certificate for gRPC (see [configuration docs](https://docs.anycable.io/anycable-go/configuration?id=tls)).

Alternatively, you may consider adding a standalone load balancer with gRPC support (this is out of scope of this guide).
