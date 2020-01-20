# Getting Started with AnyCable on Rails

AnyCable initially was designed for Rails applications only.

Since version 0.4.0 Rails integration has been extracted into a separate gem–[`anycable-rails`](https://github.com/anycable/anycable-rails).

## Requirements

- Ruby >= 2.4
- Rails >= 5.0
- Redis (when using Redis [broadcast adapter](broadcast_adapters.md))

## Installation

Add `anycable-rails` gem to your Gemfile:

```ruby
gem "anycable-rails"

# when using Redis broadcast adapter
gem "redis", ">= 4.0"
```

(and don't forget to run `bundle install`).

## Configuration

Next, update your Action Cable configuration:

```yml
# config/cable.yml
production:
  # Set adapter to any_cable to activate AnyCable
  adapter: any_cable
```

Install [WebSocket server](../websocket_servers.md) and specify its URL in the configuration:

```ruby
# For development it's likely the localhost

# config/environments/development.rb
config.action_cable.url = "ws://localhost:3334/cable"

# For production it's likely to have a sub-domain and secure connection

# config/environments/production.rb
config.action_cable.url = "wss://ws.example.com/cable"
```

Now you can start AnyCable RPC server for your application:

```sh
$ bundle exec anycable
#> Starting AnyCable gRPC server (pid: 48111)
#> Serving Rails application from ./config/environment.rb

# don't forget to provide Rails env in production
$ RAILS_ENV=production bundle exec anycable
```

**NOTE**: you don't need to specify `-r` option (see [CLI docs](cli.md)), your application would be loaded from `config/environment.rb`.

And, finally, run AnyCable WebSocket server, e.g. [anycable-go](../anycable-go/getting_started.md):

```sh
$ anycable-go --host=localhost --port=3334

INFO 2019-08-07T16:37:46.387Z context=main Starting AnyCable v0.6.2-13-gd421927 (with mruby 1.2.0 (2015-11-17)) (pid: 1362)
INFO 2019-08-07T16:37:46.387Z context=main Handle WebSocket connections at /cable
INFO 2019-08-07T16:37:46.388Z context=http Starting HTTP server at localhost:3334
```

You can store AnyCable-specific configuration in YAML file (similar to Action Cable one):

```yml
# config/anycable.yml
development:
  redis_url: redis://localhost:6379/1
production:
  redis_url: redis://my.redis.io:6379/1
```

Or you can use the environment variables (or anything else supported by [anyway_config](https://github.com/palkan/anyway_config)).

### Access logs

Rails integration extends the base [configuration](configuration.md) by adding a special parameter–`access_logs_disabled`.

This parameter turn on/off access logging (`Started <request data>` / `Finished <request data>`) (disabled by default).

You can configure it via env var (`ANYCABLE_ACCESS_LOGS_DISABLED=0` to enable) or config file:

```yml
# config/anycable.yml
production:
  access_logs_disabled: false
```

### Forgery protection

AnyCable respects [Action Cable configuration](https://guides.rubyonrails.org/action_cable_overview.html#allowed-request-origins) regarding forgery protection if and only if `ORIGIN` header is proxied by WebSocket server:

```sh
# with anycable-go
$ anycable-go --headers=cookie,origin --port=3334
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

Read more about [logging](./logging.md).

## Development and test

AnyCable is [compatible](compatibility.md) with the original Action Cable implementation; thus you can continue using Action Cable for development and tests.

Compatibility could be enforced by [runtime checks](compatibility.md#runtime-checks) or [static checks](compatibility.md#rubocop-cops) (via [RuboCop](https://github.com/rubocop-hq/rubocop)).

Use process manager (e.g. [Hivemind](https://github.com/DarthSim/hivemind) or [Overmind](https://github.com/DarthSim/overmind)) to run AnyCable processes in development with the following `Procfile`:

```procfile
web: bundle exec rails s
rpc: bundle exec anycable
ws:  anycable-go --port 3334
```

## Links

- [Plugging in AnyCable](https://www.driftingruby.com/episodes/plugging-in-anycable) at Drifting Ruby
- [Demo application](https://github.com/anycable/anycable_demo)
- [From Action to Any](https://medium.com/@leshchuk/from-action-to-any-1e8d863dd4cf)
