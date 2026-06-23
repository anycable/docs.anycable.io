# Telehealth & collaboration

A telehealth consultation, a shared document, or a support session has the same
realtime needs: each participant must know who else is present, messages and
signaling must arrive reliably and in order, and the session must not drop when
you deploy. For healthcare specifically, where the data is sensitive, you also
need control over where the realtime server runs.

AnyCable covers all of this: [presence](../anycable-go/presence.md) for who is in
the room, [reliable streams](../anycable-go/reliable_streams.md) for ordered,
recoverable messaging, and self-hosted or on-premise deployment for compliance.

## Architecture

```
  Patient  ◄── WebSocket ──┐
                           ├── AnyCable ── presence (who's in the room)
  Clinician ◄── WebSocket ─┘   (self-hosted)  reliable session stream
                                 ▲
                                 │ POST /_broadcast (chat, status, signaling)
                            Your backend
```

One stream per session (`consultation/<id>`) carries presence and messages.
WebRTC media flows peer-to-peer; AnyCable carries the signaling and session
state, not the video itself.

## 1. Run the server

```sh
anycable-go --presets=broker --broadcast_adapter=http --public
# --public is for local dev only (the client below subscribes to unsigned streams);
# in production, drop --public and require JWT + signed streams (see Production notes)
```

For sensitive data, run AnyCable inside your own infrastructure. It is a single
self-hosted Go binary with no external dependencies in the standalone setup, so
it fits on-premise and isolated environments. See [Docker](../deployment/docker.md) or [Kubernetes](../deployment/kubernetes.md) deployment.

## 2. Join the session and track presence

```js
import { createCable } from '@anycable/web'
const cable = createCable({ protocol: 'actioncable-v1-ext-json' })

const session = cable.streamFrom('consultation/abc123')

// Announce yourself to the room
await session.presence.join(user.id, { name: user.name, role: user.role })

// React to the other party joining or leaving
session.on('presence', ({ type, id, info }) => {
  if (type === 'join') showParticipant(info)
  if (type === 'leave') showWaiting(info)
})

// Who is in the room right now
const inRoom = await session.presence.info()
```

This is verified behavior: when one participant joins, the other receives a
`join` event with their info; `presence.info()` returns the full set; leaving (or
disconnecting) emits a `leave`. A short presence TTL keeps a brief network drop
from ejecting someone mid-consultation.

## 3. Exchange messages and signaling

Broadcast chat, status changes, and WebRTC signaling to the session stream from
your backend:

```python
import os, json, httpx

BROADCAST_URL = os.environ["ANYCABLE_BROADCAST_URL"]  # e.g. http://localhost:8090/_broadcast

def publish(stream, payload):
    httpx.post(BROADCAST_URL, json={"stream": stream, "data": json.dumps(payload)})

def send_to_session(session_id, event):
    publish(f"consultation/{session_id}", event)

send_to_session("abc123", {"type": "chat", "from": "clinician", "text": "Can you hear me?"})
```

Because the stream is ordered and replayable, a participant whose connection
blinks rejoins and catches up on the messages they missed rather than losing
them. See [delivery guarantees](../capabilities.md#delivery-guarantees).

## Why this holds up

- **Presence is built in and verified end-to-end** (join/leave/info across
  clients), so "is my doctor here yet?" is answered without custom code.
- **No dropped consultations on deploy.** AnyCable is a separate process, so
  releasing your app does not disconnect an in-progress session. See
  [zero-downtime deploys](../capabilities.md#deploys).
- **You control the deployment.** Self-host or run on-premise for HIPAA and
  similar requirements. [AnyCable+](https://plus.anycable.io) also offers managed
  options when you do not need on-premise.

## Production notes

- **Authorization.** Authenticate every participant with
  [JWT](../anycable-go/jwt_identification.md) and restrict each session stream
  with [signed streams](../anycable-go/signed_streams.md), so only the patient
  and clinician can join a given consultation.
- **Presence TTL.** Tune `--presence_ttl` to your tolerance for brief
  disconnects during a call.
- **Audit and data residency.** Running the server yourself keeps session
  metadata within your boundary. Pair with your existing logging and audit
  pipeline.

## Related

- [Presence tracking](../anycable-go/presence.md)
- [Reliable streams](../anycable-go/reliable_streams.md)
- [JWT authentication](../anycable-go/jwt_identification.md)
