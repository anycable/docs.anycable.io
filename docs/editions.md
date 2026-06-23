# Editions

AnyCable comes in three editions. They share the same protocol, the same
configuration, and the same client SDKs, so your application code does not change
between them. You change which server you run or connect to, not how you
integrate.

- **Open source** — the full Go server, free and self-hosted. MIT licensed.
- **[Pro](./pro.md)** — the same server with a denser memory model, cluster
  features, and extra protocols. A drop-in replacement for the open-source binary.
- **[AnyCable+](https://plus.anycable.io)** — Pro as a managed service, so you do
  not operate the server yourself. Free tier available.

## Which one

- Start on **open source** if you are self-hosting and a single node (or a
  NATS-based cluster) covers your scale. It already includes reliable streams,
  presence, signed streams, JWT, SSE, and the Pusher protocol.
- Move to **Pro** when you want the lower per-connection memory at scale, a
  Redis- or Valkey-backed cluster with shared history and presence, or the Pro-only
  protocols (Apollo GraphQL, long polling, OCPP).
- Choose **AnyCable+** when you would rather not run and scale the server
  yourself. It is the fastest way to start; you can self-host later without
  changing your application.

## Feature comparison

| | Open source | Pro | AnyCable+ |
|---|---|---|---|
| License / model | MIT, self-hosted | Commercial, self-hosted | Managed service |
| Action Cable / RPC, standalone pub/sub | ✓ | ✓ | ✓ |
| Signed streams, JWT auth | ✓ | ✓ | ✓ |
| Reliable streams & resumable sessions | ✓ (memory, NATS) | ✓ (+ Redis/Valkey, multi-node) | ✓ |
| Presence | ✓ (single node) | ✓ (+ cluster via Redis/Valkey) | ✓ |
| SSE, Pusher protocol | ✓ | ✓ | ✓ |
| Memory per connection (benchmark) | ~34 KB | ~18 KB | ~18 KB |
| Adaptive RPC concurrency | — | ✓ | ✓ |
| Binary formats (Msgpack, Protobuf) | — | ✓ | ✓ |
| Apollo GraphQL protocol | — | ✓ | ✓ |
| Long polling | — | ✓ | ✓ |
| OCPP (EV charging) | — | ✓ | ✓ |
| Slow drain on shutdown | — | ✓ | ✓ |
| Hosting & scaling | you | you | AnyCable |
| Support | community | commercial | included |

For the full Pro feature details, see [Going Pro](./pro.md). Memory figures come
from the published [Node.js WebSocket
benchmark](https://anycable.io/compare/nodejs-websocket/).

## Moving between editions

Because the protocol and configuration are shared:

- **OSS to Pro**: swap the binary and add a license. Your channels, JWT issuing,
  stream signing, broadcasting, and client code are unchanged. Pro reads the same
  configuration and enables its extra features through additional options.
- **Self-hosted to AnyCable+**: point your client connection and broadcasts at
  the managed endpoint. Your application integration stays the same.

→ [Install Pro](./pro/install.md) · [AnyCable+](https://plus.anycable.io)
