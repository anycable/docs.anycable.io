# Architecture

## Overview

<img class="is-light" alt="AnyCable arhictecture" src="../assets/images/scheme.png">
<img class="is-dark" alt="AnyCable arhictecture" src="../assets/images/scheme_invert.png">

AnyCable **WebSocket server** (1) is responsible for handling clients, or sockets. That includes:

- low-level connections (sockets) management
- subscriptions management
- broadcasting messages to clients

WebSocket server should include gRPC client built from AnyCable [`rpc.proto`](misc/rpc_proto.md).

**RPC server** (2) is a connector between the Ruby application (e.g. Rails) and WebSocket server. It’s an instance of your application with a [gRPC](https://grpc.io) endpoint which implements `rpc.proto`.

This server is a part of the [`anycable` CLI](ruby/cli.md).

We use a **Pub/Sub service** (3) to send messages from the application to the WS server, which then broadcasts the messages to clients.

See the list of supported [broadcast adapters](ruby/broadcast_adapters.md).

## State management

AnyCable's is different to the most WebSocket servers in the way connection states are stored: all the information about client connections is kept in WebSocket server; an RPC server operates on temporary, short-lived, objects passed with every gRPC request.

That means, for example, that you cannot rely on instance variables in your channel and connection classes. Instead, you should use specified _state_ objects, provided by AnyCable (read more about [channel states](ruby/channels_state.md)).

A client's state consists of three parts:

- **connection identifiers**: populated once during the connection, read-only (correspond to `identified_by` in Action Cable);
- **connection state**: key-value store for arbitrary connection metadata (e.g., tagged logger tags stored this way);
- **channel states**: key-value store for channels (for each subscription).

This is how AnyCable manages these states under the hood:

- A client connects to the WebSocket server, `Connect` RPC is made, which returns _connection identifiers_ and the initial _connection state_. All subsequent RPC calls contain this information (as long as underlying HTTP request data).
- Every time a client performs an action for a specific channel, the _channel state_ for the corresponding subscription is provided in the RPC payload.
- If during RPC invocation connection or channel state has been changed, the **changes** are returned to the WebSocket server to get merge with the full state.

Thus, the amount of state data passed in each RPC request is minimized.

### Restoring state objects

A state is stored in a serialized form in WebSocket server and deserialized (lazily) during each RPC request (in Rails, we rely on [GlobalID](https://github.com/rails/globalid) for that).

This results in a slightly different behaviour comparing to persistent, long-lived, state.

For example, if you use an Active Record object as an identifier (e.g., `user`), it's _reloaded_ in every RPC action it's used.

<!-- TODO: replace with demo link -->
To use arbitrary Ruby objects as identifiers, you must add GlobalID support for them (see, for example, this [SO answer](https://stackoverflow.com/questions/61866192/anycable-retrieve-information-grpc-info-on-ror-app/62149645#62149645)).
