# Broadcast Adapters

Broadcast adapter is used to proxy messaged published by your application to WebSocket server which in its turn broadcast messages to clients (see [architecture](../architecture.md)).

That is, when you call `ActionCable.server.broadcast`, AnyCable first pushes the message to WebSocket server via broadcast adapter, and the actual _broadcasting_ is happening within a WS server.

AnyCable allows you to use custom broadcasting adapters (Redis is used by default):

```ruby
# Specify by name (tries to load `AnyCable::BroadcastAdapters::MyAdapter` from
# "anycable/broadcast_adapters/my_adapter")
AnyCable.broadcast_adapter = :my_adapter, {option: "value"}
# or provide an instance (should respond_to #broadcast)
AnyCable.broadcast_adapter = MyAdapter.new
```

**NOTE:** to use Redis adapter, you must ensure that it is present in your Gemfile; AnyCable gem doesn't have `redis` as a dependency anymore. Want to have a different adapter out-of-the-box? Join [the discussion](https://github.com/anycable/anycable/issues/2).
