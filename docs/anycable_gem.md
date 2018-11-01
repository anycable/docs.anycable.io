# Using `anycable` gem

[AnyCable gem](https://github.com/anycable/anycable) consists of a gRPC server implementation and a CLI to run this server along with your Ruby application.

It acts like a bridge beetween WebSocket server and _cable-like_ framework, which could be one of the following:
- Action Cable when using Rails (see [AnyCable Rails](./anycable_rails.md))
- [Lite Cable](./lite_cable.md)–Action Cable for  _plain_ Ruby projects
- your own [AnyCable-complient framework](./how_to_anycable_framework.md).

## Usage

Add `anycable` gem to your `Gemfile`:

```ruby
gem "anycable"
```

(and don't forget to run `bundle install`).

Now you're able to run `anycable` CLI and start gRPC server:

```sh
$ bundle exec anycable --require "./path/to/app.rb"
#> Starting AnyCable gRPC server (pid: 48111)
#> AnyCable version: 0.6.0
#> gRPC version: 1.16.0
#> Loading application from ./path/to/app.rb ...
#> Application is loaded
#> ...
```

You only have to tell AnyCable where to find your application code.

**NOTE:** AnyCable tries to detect where to load your app from if no `--require` options is provided.
It checks for `config/environment.rb` and `config/anycable.rb` files presence.

## Configuration

AnyCable uses [`anyway_config`](https://github.com/palkan/anyway_config) gem for configuration, thus it is possible to set configuration variables through environment vars, `config/anycable.yml` file or `secrets.yml` when using Rails.

You can also pass configuration variables to CLI as options, e.g.:

```sh
$ bundle exec anycable --rpc-host 0.0.0.0:50120 \ 
                       --redis-channel my_redis_channel \
                       --log-level debug
```

**NOTE:** CLI options take precedence over parameters from other sources (files, env).

Run `anycable -h` to see the list of all available options and their defaults.
