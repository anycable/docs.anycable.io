# What is AnyCable?

AnyCable is a realtime server with **delivery guarantees** for Rails, Laravel,
Node.js, Python, and any backend that can speak HTTP. It handles the hard parts
of production WebSockets so your application does not have to: recovering missed
messages after a connection blip, keeping users connected through deploys,
tracking presence, and preserving message order.

It has been in production since 2017 and powers realtime features across
healthtech, fintech, field services and IoT, collaboration tools, and SaaS
products.

> **In a hurry?** Jump to the [Quick Start](./quickstart.md) and pick your stack.

## Why a separate realtime server

Most frameworks let you add WebSockets inside your application process. That is
fine until production reality arrives:

- A user's network blinks for two seconds and the messages sent during that
  window are gone for good.
- You deploy, the process restarts, and every connected user is dropped at once.
- Traffic grows and a single application process becomes the bottleneck for
  every open connection.

AnyCable runs as a dedicated process next to your app. Your application stays
the source of truth for authentication and business logic; AnyCable owns the
connections. Because it is a separate process, **a deploy of your app does not
touch live connections**, and because it is written in Go, a single instance
holds **over 820,000 idle connections** at roughly 18 KB of RAM each (Pro), all
while keeping latency low.

We measured these properties against popular Node.js setups (Socket.IO,
uWebSockets.js). The full methodology and raw numbers are public; see the
[Node.js WebSocket comparison](https://anycable.io/compare/nodejs-websocket/).
The highlights, on a single 32 GB box:

- **Capacity:** 822,037 idle connections (Pro), where single-threaded Socket.IO
  topped out near 120,000.
- **Memory:** ~18 KB per connection (Pro), ~34 KB (OSS).
- **Latency:** 3 ms median, 11 ms p99 at 10,000 subscribers (Pro).
- **Reliability:** 100% of messages delivered under repeated network drops,
  where at-most-once setups lost 13-15%.
- **Deploys:** zero connections lost across application deploys that otherwise
  disconnected every user.

## What you get

| Capability | What it means |
|---|---|
| [Delivery guarantees & recovery](./capabilities.md#delivery-guarantees) | Clients catch up on messages missed during a disconnect |
| [Message ordering](./capabilities.md#ordering) | Messages arrive in the order they were published |
| [Presence](./capabilities.md#presence) | Track who is online in a stream, with join/leave events |
| [Zero-downtime deploys](./capabilities.md#deploys) | Connections survive application restarts |
| [Efficiency at scale](./capabilities.md#efficiency) | Over 800,000 connections per instance in Go |
| [Binary formats](./capabilities.md#binary) | Msgpack and Protobuf encoding to cut bandwidth (Pro) |

See the [Capabilities](./capabilities.md) overview for how each one works and
where it is documented.

## How it fits your application

AnyCable supports two integration styles. You can mix them in one application.

**1. Pub/sub (standalone).** AnyCable handles connections and streams on its
own. Your app authorizes clients with [JWT](./anycable-go/jwt_identification.md)
and publishes messages over HTTP or to [signed
streams](./anycable-go/signed_streams.md). No persistent connection between
AnyCable and your backend is required. This is the quickest path for Node.js,
Python, Laravel, and any HTTP backend.

**2. RPC-backed.** AnyCable delegates connection and subscription logic to your
application over [RPC](./anycable-go/rpc.md). This is the default for Rails,
where AnyCable is a drop-in replacement for Action Cable and reuses your
existing channels.

## Editions

AnyCable comes in three editions that share the same protocol and
configuration, so you can move between them as your needs change.

- **Open source.** The full-featured Go server, free and
  [self-hosted](./quickstart.md). MIT licensed.
- **[Pro](./pro.md).** The same server with a denser memory model (further
  RAM reduction at scale), multi-node stream history, adaptive RPC concurrency,
  binary formats, and additional protocols (Apollo GraphQL, long polling, OCPP).
  It is a drop-in replacement for the open-source binary.
- **[AnyCable+](https://plus.anycable.io).** A managed service, so you do not
  run the server yourself. Free tier available.

## Next steps

- [Quick Start](./quickstart.md): get a server running and a client connected, by stack.
- [Capabilities](./capabilities.md): the features that make AnyCable a realtime framework, not just a transport.
- [Using with Rails](./rails/getting_started.md): the Action Cable drop-in path.
