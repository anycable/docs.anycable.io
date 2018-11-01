# `anycable` gem

[AnyCable gem](https://github.com/anycable/anycable) consists of a gRPC server implementation and a CLI to run this server along with your Ruby application.

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

Run `anycable -h` to see the list of all available options and their defaults.
