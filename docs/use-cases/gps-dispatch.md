# GPS tracking & dispatch

Field services, delivery, ride-hailing, and logistics apps track moving assets in
real time: drivers, vehicles, couriers. Two questions dominate the realtime
layer. Where is each asset right now, and which assets are online and available
to dispatch? The first is an ordered stream of location updates; the second is
presence.

AnyCable provides both, plus the resilience these apps need: devices on cellular
networks disconnect constantly, and updates must not be lost or arrive out of
order.

## Architecture

```
  Devices (drivers)  ──► your backend ──► POST /_broadcast ──► AnyCable
   location updates                                              │
                                                                 ▼
  Dispatchers / customers ◄────────── WebSocket ────────── location streams
                                                          + presence (who's online)
```

- **Location stream per asset** (`driver/<id>/location`), so a customer watching
  one delivery subscribes to just that asset.
- **A dispatch-area presence set** so dispatchers see which drivers are online.

## 1. Run the server

```sh
anycable-go --presets=broker --broadcast_adapter=http --public
# --public is for local dev only (the client below subscribes to unsigned streams);
# in production, drop --public and use signed streams + JWT
```

The `broker` preset enables both ordered, replayable location streams and
[presence](../anycable-go/presence.md).

## 2. Ingest and broadcast location updates

Devices send updates to your backend (HTTP, MQTT, whatever you already use). Your
backend broadcasts each one to the asset's stream:

```python
import os, json, httpx

BROADCAST_URL = os.environ["ANYCABLE_BROADCAST_URL"]  # e.g. http://localhost:8090/_broadcast

def publish(stream, payload):
    httpx.post(BROADCAST_URL, json={"stream": stream, "data": json.dumps(payload)})

def on_location(driver_id, lat, lng, ts):
    publish(f"driver/{driver_id}/location", {"lat": lat, "lng": lng, "ts": ts})
```

Updates carry ordered offsets, so a watcher that reconnects after a tunnel or a
dead zone catches up rather than jumping to a stale-then-current position.

## 3. Watch a driver and track who is online

```js
import { createCable } from '@anycable/web'
const cable = createCable('ws://localhost:8080/cable', { protocol: 'actioncable-v1-ext-json' })

// Follow one driver's position
const track = cable.streamFrom('driver/42/location')
track.on('message', ({ lat, lng }) => moveMarker(lat, lng))

// Dispatch board: who is online right now
const board = cable.streamFrom('dispatch/online-drivers')
board.on('presence', ({ type, id, info }) => {
  if (type === 'join') addDriver(id, info)
  if (type === 'leave') removeDriver(id)
})
const online = await board.presence.info()
```

A driver's app joins the presence set when it goes on shift:

```js
const board = cable.streamFrom('dispatch/online-drivers')
await board.presence.join(driver.id, { name: driver.name, vehicle: driver.vehicle })
```

## Why this holds up

- **Presence is built in and verified.** Two clients sharing a presence set see
  each other's `join` and `leave` events, and `presence.info()` returns the full
  set. A driver that disconnects lingers for a short, configurable window
  (`--presence_ttl`, default 15s) so a brief signal drop does not flicker them
  off the board.
- **No lost or reordered positions.** Location updates are ordered and replayable
  on reconnect. See [delivery guarantees](../capabilities.md#delivery-guarantees).
- **Survives deploys.** Drivers and dispatchers stay connected through your
  releases. See [zero-downtime deploys](../capabilities.md#deploys).

## Production notes

- **Presence TTL vs. flaky cellular.** Raise `--presence_ttl` if drivers
  routinely lose signal for longer than 15 seconds, so they are not marked
  offline prematurely.
- **Update rate.** Throttle device updates (for example, one per 2-5 seconds, or
  on meaningful movement) to control bandwidth and battery.
- **Authorization.** Sign stream names with [signed
  streams](../anycable-go/signed_streams.md) so a customer can only watch their
  own delivery, and authenticate devices with
  [JWT](../anycable-go/jwt_identification.md).
- **IoT protocols.** For EV-charging stations, AnyCable Pro speaks the
  [OCPP](../anycable-go/ocpp.md) WebSocket protocol (currently alpha).

## Related

- [Presence tracking](../anycable-go/presence.md)
- [Reliable streams](../anycable-go/reliable_streams.md)
- [REST API](../anycable-go/api.md) for reading presence sets server-side
