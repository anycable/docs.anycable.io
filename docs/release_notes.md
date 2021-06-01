# Release Notes

This page contains combined release notes for major and minor releases of all AnyCable libraries.

## 1.1.0

**tl;dr** Housekeeping and internals refactoring, prepare for non-gRPC RPC, minor but useful additions.

See also [upgrade notes](./upgrade-notes/1_0_0_to_1_1_0.md).

### Features

- Added ability to embed AnyCable RPC into any Ruby process.

When using `anycable-rails`, set `embedded: true` in the configuration to launch RPC along with `rails s` (only for Rails 6.1+).

For any other Ruby process, drop the following snippet to launch an RPC server:

```ruby
require "anycable/cli"
AnyCable::CLI.embed!(*args) # args is a space-separated list of CLI args
```

<br/>

- New metrics for `anycable-go`:
  - `server_msg_total` and `failed_server_msg_total`: the total number of messages sent (or failed to send) by server.
  - `data_sent_bytes_total` and `data_rcvd_bytes_total`: the total amount of bytes sent to (or received from) clients.

<br/>

- New configuration parameters for `anycable-go`:
  - `--max-conn`: hard-limit the number of simultaneous server connections.
  - `--allowed_origins`: a comma-separated list of hostnames to check the Origin header against during the WebSocket Upgrade; supports wildcards, e.g., `--allowed_origins=*.evl.ms,www.evlms.io`.
  - `--ping_timestamp_precision`: define the precision for timestamps in ping messages (s, ms, ns).

<br/>

### Changes

- Ruby 2.6+ is required for all Ruby gems (`anycable`, `anycable-rails`, `anycable-rack-server`).

<br/>

- Rails 6.0+ is required for `anycable-rails`.

<br/>

- Dropped deprecated AnyCable RPC v0.6 support.

<br/>

- The `anycable` gem has been split into `anycable-core` and `anycable`.

The first one contains an abstract RPC implementation and all the supporting tools (CLI, Protobuf), the second one adds the gRPC implementation.

<br/>

- **BREAKING** Middlewares are no longer inherited from gRPC interceptors.

That allowed us to have _real_ middlewares with ability to modify responses, intercept exceptions, etc.
The API changed a bit:

```diff
 class SomeMiddleware < AnyCable::Middleware
-  def call(request, rpc_call, rpc_handler)
+  def call(rpc_method_name, request, metadata)
     yield
   end
 end
```

<br/>

- Broadcasting messages is now happening concurrently.

Now new broadcast messages are handled (and re-transmitted) concurrently by a pool of workers (Go routines).
You can control the size of the pool via the `--hub_gopool_size` configuration parameter of the `anycable-go` server (defaults to 16).

<br/>

---

For internal changes see the corresponding change logs:

- [`anycable` gem](https://github.com/anycable/anycable/blob/v1.1.0/CHANGELOG.md)
- [`anycable-rails` gem](https://github.com/anycable/anycable-rails/blob/v1.1.0/CHANGELOG.md)
- [`anycable-go`](https://github.com/anycable/anycable-go/blob/v1.1.0/CHANGELOG.md)
- [`anycable-rack-server`](https://github.com/anycable/anycable-rack-server/blob/v0.4.0/CHANGELOG.md)

---

## 1.0.0

**tl;dr** API stabilization, better Action Cable compatibility, [Stimulus Reflex][stimulus_reflex] compatibility, improved RPC communication, state persistence, HTTP broadcast adapter, Rails generators.

> Read more about the first major release of AnyCable in [Evil Martians chronicles](https://evilmartians.com/chronicles/anycable-1-0-four-years-of-real-time-web-with-ruby-and-go).

See also [upgrade notes](./upgrade-notes/0_6_0_to_1_0_0.md).

### Features

- Configure AnyCable for Rails apps via `rails g anycable:setup`.

This interactive generator guides you through all the required steps to make AnyCable up and running for development and production.

<br/>

- Channel state, or `state_attr_accessor`.

Similarly to connection identifiers, it is now possible to store arbitrary\* data for _subscriptions_ (channel instances).
Using `state_attr_accessor :a, :b` (from `anycable-rails`) you can define readers and writers to keep channel state between commands. When AnyCable is not activated (i.e., a different adapter is used for Action Cable), this method behaves like `attr_accessor`.

\* GlobalID is used for serialization and deserialization of non-primitive objects.

<br/>

- Rack middlewares support in Rails.

You can use Rack middlewares to _enhance_ AnyCable `request` object.
For that, add required middlewares to `AnyCable::Rails::Rack.middleware` using the same API as for Rails middleware.

By default, only session store middleware is included, which allows you to access `request.session` without any hacks.

A typical use-case is adding a Warden middleware for Devise-backed authentication.

See [documentation](./rails/authentication.md).

- Underlying HTTP request data in now accessible in all RPC methods.

That is, you can access `request` object in channels, too (e.g., headers/cookies/URL/etc).

<br/>

- Remote disconnects.

Disconnecting remote clients via `ActionCable.server.remote_connections.where(...).disconnect` is now supported.

<br/>

- Rails session persistence.

Now `request.session` could be persisted between RPC calls, and hence be used as a per-connection store. Originally added for [Stimulus Reflex][stimulus_reflex] compatibility.

**NOTE:** This feature is optional and should be enabled explicitly in `anycable-rails` configuration.

See [documentation](./rails/stimulus_reflex.md).

<br/>

- HTTP broadcast adapter.

Now you can experiment with AnyCable without having to install Redis.

See [documentation](./ruby/broadcast_adapters.md#http-adapter).

**NOTE:** Supported by `anycable` gem and `anycable-go`.

<br/>

- Unsubscribing from a particular stream.

See the corresponding [Rails PR](https://github.com/rails/rails/pull/37171).

<br/>

- Redis Sentinel support.

Both `anycable` gem and `anycable-go` now support using Redis with Sentinels.

See [documentation](./ruby/broadcast_adapters.md#redis-sentinel-support).

<br/>

- New metrics for `anycable-go`:
  - `mem_sys_bytes`: the total bytes of memory obtained from the OS
  - `rpc_retries_total`: the total number of retried RPC calls (higher number could indicate incorrect concurrency configuration)

<br/>

- New configuration parameters for `anycable-go`:
  - `rpc_concurrency`: the limit on the number of concurrent RPC calls (read [documentation](./anycable-go/configuration.md#concurrency-settings)).
  - `enable_ws_compression`: enable WebSocket per-message compression (disabled by default).
  - `disconnect_timeout`: specify the timeout for graceful shutdown of the disconnect queue (read [documentation](./anycable-go/configuration.md#disconnect-events-settings))
  - `disable_disconnect`: disable calling disconnect/unsubscribe callbacks.

<br/>

### Changes

- New RPC schema.

Check out the annotated [new schema](./misc/rpc_proto.md).

<br/>

- Ruby 2.5+ is required for all Ruby gems (`anycable`, `anycable-rails`, `anycable-rack-server`).

<br/>

- Docker versioning changed from `vX.Y.Z` to `X.Y.Z` for `anycable-go`.

Now you can specify only the part of the version, e.g. `anycable-go:1.0` instead of the full `anycable-go:v1.0.0`.

<br/>

---

For internal changes see the corresponding change logs:
<!-- TODO: update links after release -->

- [`anycable` gem](https://github.com/anycable/anycable/blob/v1.0.0/CHANGELOG.md)
- [`anycable-rails` gem](https://github.com/anycable/anycable-rails/blob/v1.0.0/CHANGELOG.md)
- [`anycable-go`](https://github.com/anycable/anycable-go/blob/v1.0.0/CHANGELOG.md)
- [`anycable-rack-server`](https://github.com/anycable/anycable-rack-server/blob/v0.2.0/CHANGELOG.md)

[stimulus_reflex]: https://github.com/hopsoft/stimulus_reflex
