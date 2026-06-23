# Build by use case

AnyCable powers realtime features across many domains. These guides start from
what you are building, show the architecture, and link to the features involved.
Every guide is verified against a running server.

| Use case | What you get | Guide |
|---|---|---|
| **Streaming AI responses** | Ordered token streaming with mid-response catch-up | [AI response streaming](./ai-streaming.md) |
| **Live dashboards** | High fan-out market data, metrics, and feeds | [Live dashboards](./live-dashboards.md) |
| **Location tracking & dispatch** | Device location streams with online-driver presence | [GPS tracking & dispatch](./gps-dispatch.md) |
| **Telehealth & collaboration** | Presence and reliable messaging for sessions | [Telehealth & collaboration](./telehealth.md) |

All of these build on the same primitives:

- [Delivery guarantees & recovery](../capabilities.md#delivery-guarantees) so messages survive connection blips
- [Presence](../capabilities.md#presence) to track who is online
- [Zero-downtime deploys](../capabilities.md#deploys) so realtime keeps working through releases

New to AnyCable? Start with the [Quick Start](../quickstart.md).
