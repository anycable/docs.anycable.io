# Using with Rails

AnyCable initially was designed for Rails applications only.

Since version 0.4.0 Rails integration has been extracted into a separate gem–[`anycable-rails`](https://github.com/anycable/anycable-rails).

## Requirements
- Ruby >= 2.4
- Rails >= 5.0
- Redis (when using Redis [broadcast adapter](./broadcast_adapters.md))

## Getting started

Add `anycable-rails` gem to your Gemfile:

```ruby
gem "anycable-rails"

# when using Redis broadcast adapter
gem "redis", ">= 4.0"
```

(and don't forget to run `bundle install`).

Now you can start AnyCable RPC server for your application:

```sh
$ bundle exec anycable
#> Starting AnyCable gRPC server (pid: 48111)
#> Serving Rails application from ./config/environment.rb
```

**NOTE**: you don't need to specify `-r` option (see [CLI docs](./anycable_gem.md#cli)), your application would be loaded from `config/environment.rb`.

Install [WebSocket server](./websocket_servers.md)–and you're ready to use your Rails application with AnyCable!

## Configuration

Rails integration extends the base [configuration](./configuration.md) by adding a special parameter–`access_logs_disabled`.

This parameter turn on/off access logging (`Started <request data>` / `Finished <request data>`) (disabled by default).

You can configure it via env var (`ANYCABLE_ACCESS_LOGS_DISABLED=0` to enable) or config file:

```yml
# config/anycable.yml
production:
  access_logs_disabled: false
```

## Usage

Running Rails application with AnyCable requires the following steps.

First, update your Action Cable configuration:

- Use AnyCable subscription adapter:

```yml
# config/cable.yml
production:
  adapter: any_cable
```

- Specify AnyCable WebSocket server URL

```ruby
# For development it's likely the localhost

# config/environments/development.rb
config.action_cable.url = "ws://localhost:3334/cable"

# For production it's likely to have a sub-domain and secure connection

# config/environments/production.rb
config.action_cable.url = "wss://ws.example.com/cable"
```

Then, run AnyCable RPC server:

```ruby
$ bundle exec anycable

# don't forget to provide Rails env

$ RAILS_ENV=production bundle exec anycable
```

And, finally, run AnyCable WebSocket server, e.g. [anycable-go](./go_getting_started.md):

```sh
anycable-go --host=localhost --port=3334
```

## Logging

AnyCable uses `Rails.logger` as `AnyCable.logger` by default, thus setting log level for AnyCable (e.g. `ANYCABLE_LOG_LEVEL=debug`) won't work, you should configure Rails logger instead, e.g.:

```ruby
# in Rails configuration
config.logger = Logger.new(STDOUT)
config.log_level = :debug

# or
Rails.logger.level = :debug if AnyCable.config.debug?
```

## Development and test

AnyCable is [compatible](./compatibility.md) with the original Action Cable implementation; thus you can continue using Action Cable for development and tests.

Compatibility could be enforced by [runtime checks](./compatibility.md#runtime-checks) or [static checks](./compatibility.md#rubocop-cops) (via [RuboCop](https://github.com/rubocop-hq/rubocop)).

Use process manager (e.g. [Hivemind](https://github.com/DarthSim/hivemind) or [Overmind](https://github.com/DarthSim/overmind)) to run AnyCable processes in development with the following `Procfile`:

```
web: bundle exec rails s
rpc: bundle exec anycable
ws:  anycable-go --port 3334
```

## Links

- [Demo application](https://github.com/anycable/anycable_demo)
- [From Action to Any](https://medium.com/@leshchuk/from-action-to-any-1e8d863dd4cf)
