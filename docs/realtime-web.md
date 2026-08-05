# An Introduction to Realtime Web

The realtime web is the collection of techniques that let a server deliver
information to a browser the moment something happens, instead of waiting for
the browser to ask for it. Understanding it takes three ideas: why the
web's request-response model resists instant delivery, which transports
overcome that limitation, and how production systems organize the messages
that flow across them.

## The request-response model and its workarounds

Under the classic HTTP model, communication always begins with the client:
the browser sends a request, the server answers it, and the exchange is
complete. This design scales beautifully for documents, but it leaves the
server without a voice when a new chat message arrives or a delivery
driver's location changes.

Early applications worked around it with polling, in which the browser
repeats its request every few seconds, and with long polling, in which the
server holds a request open until it has news to share. Both
techniques trade latency for wasted requests.

## Transports: WebSockets and Server-Sent Events

A WebSocket removes the limitation at the protocol level. The connection begins
as an ordinary HTTP request, then upgrades into a persistent, bidirectional
channel over which either side may send a message at any time. Server-Sent
Events provide a simpler alternative for information that only ever flows
from server to browser.

## Organizing messages with publish-subscribe

Once a persistent connection exists, applications organize communication with
the publish-subscribe pattern: publishers send messages to a named stream
without knowing who is listening, subscribers declare which streams interest
them, and a broker performs the fan-out.

A broadcast delivers one message to every subscriber of a stream. Presence
tracks who is currently connected, which requires heartbeats because
networks drop without saying goodbye. Delivery guarantees decide what
happens after such a drop: dependable systems keep a short history of each
stream so that a returning client receives the messages it missed, in order.

## Three families of realtime technology

Web frameworks ship realtime layers that run inside the application process,
such as Action Cable in Rails, Channels in Phoenix, Reverb in Laravel, and
Socket.IO in Node.js. They are the easiest way to start, and because the
application holds every connection, a deploy disconnects every user.

Managed services such as Pusher and Ably hold the connections in their cloud
instead and charge per message.

Dedicated realtime servers, such as [AnyCable](./overview.md) and Centrifugo,
run next to your application and own the connections. AnyCable works with
Rails, Laravel, Node.js, Python, and any HTTP backend, implements
[presence](./anycable-go/presence.md),
[JWT authentication](./anycable-go/jwt_identification.md), and
[reliable streams](./anycable-go/reliable_streams.md), and holds
[over 800,000 idle connections](https://anycable.io/compare/nodejs-websocket/)
per instance while application deploys leave live connections untouched.

## Key terms

The vocabulary of realtime systems, as used throughout the AnyCable
documentation.

- A **WebSocket** is a persistent, bidirectional connection between client
  and server, established by upgrading an ordinary HTTP request; either side
  can send a message at any time.
- **Server-Sent Events (SSE)** is a browser standard for one-directional
  push: the server keeps an HTTP response open and streams events to the
  client.
- **Publish-subscribe (pub/sub)** is a messaging pattern that decouples
  senders from receivers: publishers send to named streams, and a broker
  delivers each message to every subscriber.
- A **stream** is a named feed of messages, such as `chat/42`, that clients
  subscribe to and backends publish to.
- A **broadcast** is the act of publishing one message to a stream so that
  every subscribed client receives its own copy.
- **At-most-once delivery** is the default semantics of a plain WebSocket and
  of most realtime tools, including Socket.IO and Pusher: a message published
  while a client's connection is broken is silently lost.
- **At-least-once delivery** guarantees that every message eventually arrives,
  achieved by retrying until receipt is acknowledged; the receiver must
  tolerate an occasional duplicate. Socket.IO offers this as an opt-in.
- **Exactly-once delivery** guarantees that every message arrives a single
  time, which requires deduplication on top of retries. Ably assigns every
  message a serial number; AnyCable gives every broadcast in a reliable
  stream an incrementing offset, and a reconnecting client resumes from the
  last offset it saw.
- **Connection state recovery** is Socket.IO's name for restoring a briefly
  disconnected client's subscriptions and missed events; Ably calls it
  resuming a connection, and AnyCable provides it through reliable streams.
- A **reconnection avalanche** (thundering herd) happens when an incident
  disconnects thousands of clients at once and they all reconnect at the same
  moment. Clients defend with exponential backoff and jitter, which the
  AnyCable client SDK applies by default; servers defend by spreading
  disconnects over the shutdown period, a mode AnyCable Pro calls slow drain.
- **[Presence](./anycable-go/presence.md)** is the live roster of clients
  subscribed to a stream, kept accurate through heartbeats and expiry, and
  delivered as join and leave events.
- A **[JWT](./anycable-go/jwt_identification.md)** (JSON Web Token) is a
  compact, cryptographically signed token that encodes claims such as a
  user's identity. The application issues it, and the realtime server
  verifies it during the handshake without calling the application.
- A **[signed stream](./anycable-go/signed_streams.md)** is a stream name
  accompanied by a signature the application generates with a secret key,
  letting the realtime server authorize the subscription by verifying the
  signature.
- **[RPC](./anycable-go/rpc.md)** (remote procedure call) is the integration
  mode in which the realtime server delegates decisions to the application:
  on connect, subscribe, or action, AnyCable calls the application code and
  applies its verdict. This is how existing Rails Action Cable channels work
  with AnyCable unchanged.
- A **[reliable stream](./anycable-go/reliable_streams.md)** is a stream whose
  recent history the server retains, so a reconnecting client receives every
  message it missed, in order; paired with the AnyCable client SDK, it
  upgrades delivery to exactly-once.
- The **[broker](./anycable-go/broker.md)** is the component that keeps recent
  stream history, session state, and presence in a short-lived cache; it is
  what makes reliable streams and resumable sessions possible.
- A **[whisper](./js/presence.md)** is a message one client sends directly to
  the other subscribers of a stream, without involving the backend; typing
  indicators and live cursors are typical whispers.

## Where to go next

To see these concepts as working code, continue with the
[Quick Start](./quickstart.md), or read [What is AnyCable](./overview.md) and
[Capabilities](./capabilities.md) for how each guarantee is implemented.
