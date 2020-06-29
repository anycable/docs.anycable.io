# Release Notes

This page contains combined release notes for major and minor releases of all AnyCable libraries.

## 1.0.0 (release candidate)

**tl;dr** API stabilization, better Action Cable compatibility, [Stimulus Reflex][stimulus_reflex] compatibility, improved RPC communication, state persistence, HTTP broadcast adapter, Rails generators.

See also [upgrade notes](./upgrade-notes/0_6_0_to_1_0_0.md).

**NOTE:** For `anycable-rails` use version 1.0.0.rc2, other libraries haven't been updated since rc1.

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

See [documentation](./ruby/authentication.md).

- Underlying HTTP request data in now accessible in all RPC methods.

That is, you can access `request` object in channels, too (e.g., headers/cookies/URL/etc).

<br/>

- Remote disconnects.

Disconnecting remote clients via `ActionCable.server.remote_connections.where(...).disconnect` is now supported.

<br/>

- Rails session persistence.

Now `request.session` could be persisted between RPC calls, and hence be used as a per-connection store. Originally added for [Stimulus Reflex][stimulus_reflex] compatibility.

**NOTE:** This feature is optional and should be enabled explicitly in `anycable-rails` configuration.

See [documentation](./ruby/stimulus_reflex.md).

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

- [`anycable` gem](https://github.com/anycable/anycable/blob/master/CHANGELOG.md)
- [`anycable-rails` gem](https://github.com/anycable/anycable-rails/blob/master/CHANGELOG.md)
- [`anycable-go`](https://github.com/anycable/anycable-go/blob/v1.0.0/CHANGELOG.md)
- [`anycable-rack-server`](https://github.com/anycable/anycable-rack-server/blob/master/CHANGELOG.md)

[stimulus_reflex]: https://github.com/hopsoft/stimulus_reflex
