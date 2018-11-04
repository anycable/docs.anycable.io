# Logging

By default, AnyCable logger logs to STDOUT with `INFO` severity but can be easily configured (see [Configuration](./configuration#parameters)), for example:

```sh
$ bundle exec anycable --log-file=logs/anycable.log --log-level debug

# or

$ ANYCABLE_LOG_FILE=logs/anycable.log ANYCABLE_LOG_LEVEL=debug bundle exec anycable
```

You can also specify your own logger instance for full control:

```ruby
# AnyCable invokes this code before initializing the configuration
AnyCable.logger = MyLogger.new
```

## gRPC logging

AnyCable does not log any GRPC internal events by default. You can turn GRPC logger on by setting `log_grpc` parameter to true:

```sh
$ bundle exec anycable --log-grpc

# or

$ ANYCABLE_LOG_GRPC=t bundle exec anycable
```

## Debug mode

You can turn on verbose logging (with gRPC logging turned on and log level set to `"debug"`) by using a shortcut parameter–`debug`:

```sh
$ bundle exec anycable --debug

# or

$ ANYCABLE_DEBUG=1 bundle exec anycable
```
