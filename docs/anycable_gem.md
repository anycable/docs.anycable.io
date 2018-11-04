# Using `anycable` gem

[AnyCable gem](https://github.com/anycable/anycable) consists of a gRPC server implementation and a CLI to run this server along with your Ruby application.

## Requirements
- Ruby >= 2.4
- Redis (when using Redis [broadcast adapter](./broadcast_adapters.md))

## Installation

Add `anycable` gem to your `Gemfile`:

```ruby
gem "anycable", "~> 0.6.0"

# when using Redis broadcast adapter
gem "redis", ">= 4.0"
```

(and don't forget to run `bundle install`).

## CLI

Run `anycable` CLI to start a gRPC server:

```sh
$ bundle exec anycable --require "./path/to/app.rb"
#> Starting AnyCable gRPC server (pid: 48111)
#> Serving application from ./path/to/app.rb ...
#> AnyCable version: 0.6.0
#> gRPC version: 1.16.0
#> ...
```

You only have to tell AnyCable where to find your application code.

**NOTE:** AnyCable tries to detect where to load your app from if no `--require` option is provided.
It checks for `config/environment.rb` and `config/anycable.rb` files presence.

Run `anycable -h` to see the list of all available options and their defaults.

### Running WebSocket server along with RPC

AnyCable CLI provides an option to run any arbitrary command along with the RPC server. That could be useful for local development and even in production (e.g. for [Heroku deployment](./heroku.md)).

For example:

```sh
$ bundle exec anycable --server-command "anycable-go -p 3334"
#> Starting AnyCable gRPC server (pid: 48111)
#> Serving application from ./path/to/app.rb ...
#> AnyCable version: 0.6.0
#> gRPC version: 1.16.0
#> ...
#> Started command: anycable-go --port 3334 (pid: 13710)
#> ...
```
