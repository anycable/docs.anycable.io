# Live dashboards

Market data tickers, analytics dashboards, live ops boards, and leaderboards all
share one shape: one source of truth produces frequent updates, and many viewers
need them at once with low latency. The hard parts are fan-out (one update,
thousands of subscribers) and consistency (a viewer should not silently miss a
price change during a network blip).

AnyCable handles both: high fan-out from a single broadcast, and
[reliable streams](../anycable-go/reliable_streams.md) so viewers catch up after
a disconnect.

## Architecture

```
  Many browsers ◄── WebSocket ──  AnyCable  ◄── POST /_broadcast ── Your producer
   (dashboards)                  (fan-out)                          (price feed,
                                                                     metrics job)
```

One stream per dashboard or per data feed. Your producer broadcasts each update
once; AnyCable fans it out to every subscriber.

## 1. Run the server

```sh
anycable-go --presets=broker --broadcast_adapter=http --public
# --public is for local dev only (the client below subscribes to unsigned streams);
# in production, drop --public and use signed streams + JWT
```

The `broker` preset gives subscribers catch-up on reconnect, which matters for
dashboards where a missed update leaves stale numbers on screen.

## 2. Publish updates

Broadcast each update to the feed's stream. The producer can be a cron job, a
market-data consumer, or your application reacting to changes.

```python
import os, json, httpx

BROADCAST_URL = os.environ["ANYCABLE_BROADCAST_URL"]  # e.g. http://localhost:8090/_broadcast

def publish(stream, payload):
    httpx.post(BROADCAST_URL, json={"stream": stream, "data": json.dumps(payload)})

# e.g. a price tick
publish("market/AAPL", {"price": 196.42, "ts": 1718900000})
```

A single broadcast reaches every subscriber of that stream. There is no
per-connection loop in your code.

## 3. Subscribe from the dashboard

```js
import { createCable } from '@anycable/web'

const cable = createCable({ protocol: 'actioncable-v1-ext-json' })
const ticker = cable.streamFrom('market/AAPL')

ticker.on('message', (update) => {
  applyToChart(update)   // arrives in order; catch-up is automatic on reconnect
})
```

Subscribe to several streams from one connection for a multi-widget dashboard:
each widget calls `streamFrom` with its own feed name.

## Why this holds up

- **Fan-out is one broadcast.** Verified with multiple subscribers on one
  stream: a single publish reaches all of them. In the
  [benchmark](https://anycable.io/compare/nodejs-websocket/)'s broadcast-throughput
  test (10,000 subscribers, 1M messages from 40 parallel publishers), AnyCable
  delivered at a **4 ms median** versus 155 ms for default Socket.IO. (This is the
  fan-out throughput test, distinct from the latency numbers on the
  [Capabilities](../capabilities.md#efficiency) page.)
- **No stale screens after a blip.** Updates carry ordered offsets, so a viewer
  that reconnects pulls the updates it missed rather than waiting for the next
  tick. See [delivery guarantees](../capabilities.md#delivery-guarantees).
- **Survives deploys.** A release of your app does not disconnect viewers. See
  [zero-downtime deploys](../capabilities.md#deploys).

## Production notes

- **Snapshot + deltas.** For a dashboard that should show correct state
  immediately on load, send a current snapshot from your HTTP API on page load,
  then apply deltas from the stream. The stream's history covers gaps during the
  session.
- **Rate.** For very high-frequency feeds, coalesce updates server-side (for
  example, one broadcast per 100 ms per symbol) rather than one per change.
- **Authorization.** Use [signed streams](../anycable-go/signed_streams.md) so a
  viewer only subscribes to feeds they are entitled to (per-tenant dashboards,
  paid symbols).
- **Public read-only feeds.** For genuinely public data, you can enable
  [public streams](../anycable-go/signed_streams.md#public-unsigned-streams)
  (`--public_streams` / `ANYCABLE_PUBLIC_STREAMS`) instead of signing each name.

## Related

- [Broadcasting](../anycable-go/broadcasting.md)
- [Capabilities: efficiency at scale](../capabilities.md#efficiency)
- [Signed streams](../anycable-go/signed_streams.md)
