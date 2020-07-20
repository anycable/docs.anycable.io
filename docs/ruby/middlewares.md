# RPC Server Middlewares

AnyCable server allows to add custom _middlewares_ (=gRPC interceptors).

For example, `anycable-rails` ships with [the middleware](https://github.com/anycable/anycable-rails/blob/master/lib/anycable/rails/middlewares/executor.rb) that integrate [Rails Executor](https://guides.rubyonrails.org/v5.2.0/threading_and_code_execution.html#framework-behavior) into RPC server.

## Adding custom middleware

AnyCable middleware is a class inherited from `AnyCable::Middleware` and implementing `#call` method:

```ruby
class PrintMiddleware < AnyCable::Middleware
  # request - is a request payload (incoming message)
  # rpc_call - is an active gRPC call
  # handler - is a method (Method object) of RPC handler which is called
  def call(request, rpc_call, handler)
    p request
    yield
  end
end
```

**NOTE**: you MUST yield the execution; it's impossible to halt the execution and respond with data from middleware (you can only raise an exception).

Activate your middleware by adding it to the middleware chain:

```ruby
# anywhere in your app before AnyCable server starts
AnyCable.middleware.use(PrintMiddleware)

# or using instance
AnyCable.middleware.use(ParameterizedMiddleware.new(params))
```

### Example

Consider adding instrumentation via [Yabeda](https://github.com/yabeda-rb):

```ruby
class TimingMiddleware < AnyCable::Middleware
  # request - is a request payload (incoming message)
  # rpc_call - is an active gRPC call
  # handler - is a method (Method object) of RPC handler which is called
  def call(request, rpc_call, handler)
    labels = {method: handler.name}
    start = Time.now
    begin
      yield
      Yabeda.anycable_rpc_success_total.increment(labels)
    rescue Exception # rubocop: disable Lint/RescueException
      Yabeda.anycable_rpc_failed_total.increment(labels)
      raise
    ensure
      Yabeda.anycable_rpc_runtime.measure(labels, elapsed(start))
      Yabeda.anycable_rpc_executed_total.increment(labels)
    end
  end

  private

  def elapsed(start)
    (Time.now - start).round(3)
  end
end
```

The complete example could be found in the [demo app](https://github.com/anycable/anycable_demo/blob/v0.6.0/config/initializers/yabeda.rb).
