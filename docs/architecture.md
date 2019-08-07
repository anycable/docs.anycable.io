# Architecture

![AnyCable arhictecture](assets/images/scheme.png)

AnyCable **WebSocket server** (1) is responsible for handling clients, or sockets. That includes:

- low-level connections (sockets) management
- subscriptions management
- broadcasting messages to clients

WebSocket server should include gRPC client built from AnyCable [`rpc.proto`](misc/rpc_proto.md).

**RPC server** (2) is a connector between the Ruby application (e.g. Rails) and WebSocket server. It’s an instance of your application with a [gRPC](https://grpc.io) endpoint which implements `rpc.proto`.

This server is a part of the [`anycable` CLI](ruby/cli.md).

We use a **Pub/Sub service** (3) to send messages from the application to the WS server, which then broadcasts the messages to clients.

**NOTE**: Currently, only Redis is supported as Pub/Sub service. See [Broadcast Adapters](ruby/broadcast_adapters.md).
