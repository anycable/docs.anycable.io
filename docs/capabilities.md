# Capabilities

Socket.IO and uWebSockets give you a transport. AnyCable gives you a realtime
framework: the delivery, presence, and deploy guarantees that production
realtime features actually need. This page maps each capability to where it is
documented.

Every claim below is exercised against the running server; numbers come from the
public [Node.js WebSocket benchmark](https://anycable.io/compare/nodejs-websocket/).

## Delivery guarantees & recovery {#delivery-guarantees}

A user's network blinks. With an at-most-once transport, every message sent
during that window is gone. AnyCable keeps a short-lived history of each stream,
so a reconnecting client catches up on exactly what it missed.

How it works: with [reliable streams](./anycable-go/reliable_streams.md) enabled
(the `broker` preset), every broadcast is tagged with a sequential `offset` and
an `epoch`. The [client SDK](https://github.com/anycable/anycable-client) tracks
the last offset it saw and, on reconnect, requests history from that point. The
server replays the missed messages and acknowledges with `confirm_history`. If
history is no longer available, the client gets `reject_history` and can fall
back, so loss is always signaled.

This takes AnyCable from **at-most-once** to **at-least-once**, and to
**exactly-once** when the client de-duplicates by offset.

In the benchmark, under repeated two-second network drops, AnyCable delivered
**100%** of messages where default Socket.IO delivered 84.6% and uWebSockets
87.0%.

```sh
anycable-go --presets=broker
```

→ [Reliable streams and resumable sessions](./anycable-go/reliable_streams.md)

## Message ordering {#ordering}

Messages in a stream are assigned monotonically increasing offsets and delivered
in that order. Combined with offset tracking on the client, this gives ordered,
gap-aware delivery: a client can always tell whether it has every message up to
its current position. Ordering is part of the same
[broker](./anycable-go/broker.md) machinery as recovery.

→ [Broker deep dive](./anycable-go/broker.md)

## Resumable sessions {#sessions}

When the broker is enabled, each connection gets a session id. If a client
reconnects within the session TTL, it restores its state (identifiers and
subscriptions) without re-authenticating or re-subscribing. This makes
reconnects cheap for both the client and your backend.

Note: restored sessions do not currently re-fire connect/disconnect callbacks in
your application. See the
[reliable streams notes](./anycable-go/reliable_streams.md#resumed-sessions-vs-disconnect-callbacks)
before relying on those callbacks.

→ [Resumable sessions](./anycable-go/reliable_streams.md)

## Presence {#presence}

Knowing who is online in a channel usually means writing custom storage and
heartbeat code. AnyCable has [presence](./anycable-go/presence.md) built in.
Clients join a stream's presence set with an id and arbitrary info; all
subscribers receive `join` and `leave` events, and can read the current set.

Presence is part of the broker, so the same `broker` preset enables it.
Disconnected clients linger in the set for a short, configurable window
(`--presence_ttl`, default 15s) to avoid churn on flaky connections.

```js
channel.presence.join(user.id, { name: user.name })
channel.on('presence', ({ type, id, info }) => { /* join / leave */ })
```

→ [Presence tracking](./anycable-go/presence.md)

## Zero-downtime deploys {#deploys}

Because AnyCable runs as a process separate from your application, deploying your
app does not touch live WebSocket connections. Your app restarts; AnyCable stays
up; users stay connected.

In the benchmark's rolling-deploy test, an embedded Socket.IO server dropped
every connection on each deploy and, at 20K clients, only 33% reconnected within
the measurement window. AnyCable lost **zero** connections, because the deploy
never restarted it.

For RPC-backed (Rails) setups, you roll your application and RPC servers while
the WebSocket server keeps running. Pro adds a
[slow drain mode](./anycable-go/configuration.md#slow-drain-mode) to spread
reconnects when you do restart the WebSocket layer.

→ [Load balancing](./deployment/load_balancing.md) ·
[Kamal deployment](./deployment/kamal.md)

## Efficiency at scale {#efficiency}

AnyCable is written in Go, so a single instance holds a large number of
long-lived connections with a small per-connection footprint. In the 1M-target
idle benchmark on a single 32 GB box:

- **822,037** idle connections held (Pro), **821,877** (OSS).
- **~18 KB** per connection (Pro), **~34 KB** (OSS).
- **3 ms** median / **11 ms** p99 latency at 10,000 subscribers (Pro).

Single-threaded JS servers hit a CPU ceiling far earlier: Socket.IO topped out
around **120,000** connections on the same hardware, with one core saturated.

We report this honestly: a bare transport like uWebSockets holds more
connections per gigabyte (around 5 KB each) because it does less. AnyCable
trades some of that density for delivery guarantees, presence, and deploy
resilience.

→ [Benchmarks](./benchmarks.md) ·
[OS tuning](./anycable-go/os_tuning.md) ·
[Going Pro](./pro.md)

## Binary formats {#binary}

For high-volume or bandwidth-sensitive workloads, AnyCable Pro can serialize
messages with **Msgpack** or **Protobuf** instead of JSON. Both reduce the bytes
on the wire and speed up encoding and decoding; the client SDK supports them out
of the box by setting an encoder and protocol.

In the documented comparison, the same broadcast workload sent 502 MB as JSON,
340 MB as Msgpack, and 315 MB as Protobuf, with Protobuf also decoding roughly
3x faster than JSON. Binary formats help most for structured (object-like)
payloads; they help less when you broadcast long strings such as HTML fragments.

```js
import { createCable } from '@anycable/web'
import { ProtobufEncoder } from '@anycable/protobuf-encoder'

export default createCable({ protocol: 'actioncable-v1-protobuf', encoder: new ProtobufEncoder() })
```

→ [Binary messaging formats](./anycable-go/binary_formats.md)

## Authentication & authorization {#auth}

AnyCable authenticates connections and authorizes streams without requiring a
persistent link to your backend:

- [JWT authentication](./anycable-go/jwt_identification.md): your backend issues
  a token, the client presents it on connect.
- [Signed streams](./anycable-go/signed_streams.md): your backend signs stream
  names so clients can only subscribe to what you allow. The signing algorithm
  is plain HMAC-SHA256, identical across Ruby, Node, Python, and PHP.

→ [JWT authentication](./anycable-go/jwt_identification.md) ·
[Signed streams](./anycable-go/signed_streams.md)
