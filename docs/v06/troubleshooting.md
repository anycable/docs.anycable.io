# Troubleshooting 🔥

## `ActionCable.server.broadcast` doesn't send messages

The most common problem is using different Redis channels within RPC instance and `anycable-go`. Find the following line in the logs:

```sh
# for AnyCable-Go
$ anycable-go
...
INFO time context=pubsub Subscribed to Redis channel: __anycable__

# for RPC
$ bundle exec anycable
...
I, [2019-03-06T10:08:03.915310 #7922]  INFO -- : Broadcasting Redis channel: __anycable__
```

Make sure that both servers use the same Redis channel (`__anycable__` in the example above).

Related issues: [#78](https://github.com/anycable/anycable/issues/78), [#45](https://github.com/anycable/anycable/issues/45).

## Server raises an `ArgumentError` exception when client tries to connect

If you encounter the following exception:

```sh
Exception: ArgumentError: wrong number of arguments (given 2, expected 1)
  .../gems/anycable-rails-0.6.1/lib/anycable/rails/actioncable/connection.rb:34:in initialize'
  .../gems/actioncable-5.1.7/lib/action_cable/server/base.rb:28:in
  ...
```

that means you're client tries to connect to the built-in Action Cable server, and not the AnyCable one.

Check that:

- `config.action_cable.url` points to the AnyCable server and not to the Rails one
- in case of using a reverse proxy (e.g. Nginx), check that it points to the correct server as well.

Related issues: [#88](https://github.com/anycable/anycable-rails/issues/88), [#22](https://github.com/anycable/anycable-rails/issues/22).

## Authentication fails with `undefined method 'protocol' for nil:NilClass`

That could happen if there is a monkey-patch overriding the default Action Cable behaviour. For example, `lograge` [does this](https://github.com/roidrage/lograge/pull/257#issuecomment-525690256) (at least versions <= 0.11.2).

Related issues: [#103](https://github.com/anycable/anycable-rails/issues/103).

## My WebSocket connection fails with "Auth failed" error

It's likely that you're using cookie-based authentication. Make sure that your cookies are accessible from both domain (HTTP server and WebSocket server). For example:

```ruby
# session_store.rb
Rails.application.config.session_store :cookie_store,
  key: "_any_cable_session",
  domain: :all # or domain: '.example.com'

# anywhere setting cookie
cookies[:val] = {value: "1", domain: :all}
```

**NOTE**: It's impossible to set cookies for `.herokuapp.com`. [Read more](https://devcenter.heroku.com/articles/cookies-and-herokuapp-com).

## I see a lot of `too many open files` errors in the log

Congratulations! You have a lot (thousands) of simultaneous connections (and you hit the max open files limit).

For example, Heroku _standard_ dynos have a limit (both soft and hard) of 10000 open files, and _performance_ dynos have a limit of 1048576.

Does this mean that the theoretical limit of connections is 10k for standard dynos? Yes, but only theoretical.
But in practice, the process doesn't free open files (sockets in our case) immediately after disconnection; it waits for TCP close handshake to finish (and you can find such sockets in `CLOSE_WAIT` state).

So, if a lot of clients dropping connections, the actual limit on the number of active connections could be much less at the specific moment.

See the [OS tuning](anycable-go/os_tuning.md) guide for possible solutions.

Related issues: [#79](https://github.com/anycable/anycable-rails/issues/79).

## Problems with Docker alpine images

AnyCable ruby gem relies on [`google-protobuf`](https://rubygems.org/gems/google-protobuf) and [`grpc`](https://rubygems.org/gems/grpc) gems, which use native extensions.

That could bring some problems installing `anycable` on alpine Docker images due to the incompatibility
of the pre-built binaries.

Usually, building the gems from source:

```ruby
# use a gem from git
gem "google-protobuf", git: "https://github.com/google/protobuf"
```

Another option is to force Bundler to build native extensions during the installation:

```sh
BUNDLE_FORCE_RUBY_PLATFORM=1 bundle install
```

See the [example Dockerfile](https://github.com/anycable/anycable/blob/master/etc/Dockerfile.alpine).

Related issues: [#70](https://github.com/anycable/anycable-rails/issues/70), [#47](https://github.com/anycable/anycable/issues/47).
