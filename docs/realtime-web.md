# An Introduction to Realtime Web

The realtime web is the collection of techniques that let a server deliver
information to a browser the moment something happens, instead of waiting for
the browser to ask for it. This page explains why the web's original
request-response model makes instant delivery difficult, introduces the
transports that overcome that limitation, and surveys the technology that
implements them in production.

Under the classic HTTP model, communication always begins with the client: the
browser sends a request, the server answers it, and the exchange is complete.
This design scales beautifully for documents, but it leaves the server without
a voice when a new chat message arrives or a delivery driver's location
changes. Early applications worked around the limitation with polling, in
which the browser repeats its request every few seconds, and with long
polling, in which the server holds a request open until it has news to share;
both techniques trade latency for wasted requests.

A WebSocket removes the limitation at the protocol level. The connection
begins as an ordinary HTTP request, then upgrades into a persistent,
bidirectional channel over which either side may send a message at any time.
Server-Sent Events provide a simpler alternative for information that only
ever flows from server to browser.

Once a persistent connection exists, applications organize communication with
the publish-subscribe pattern: publishers send messages to a named stream
without knowing who is listening, subscribers declare which streams interest
them, and a broker performs the fan-out. A broadcast delivers one message to
every subscriber of a stream, and presence tracks who is currently connected,
which requires heartbeats because networks drop without saying goodbye.
Delivery guarantees decide what happens after such a drop: dependable systems
keep a short history of each stream so that a returning client receives the
messages it missed, in order.

The technology comes in three families. Web frameworks ship realtime layers
that run inside the application process, such as Action Cable in Rails,
Channels in Phoenix, Reverb in Laravel, and Socket.IO in Node.js; they are the
easiest way to start, and because the application holds every connection, a
deploy disconnects every user. Managed services such as Pusher and Ably hold
the connections in their cloud instead and charge per message. Dedicated
realtime servers, such as [AnyCable](./overview.md) and Centrifugo, run next
to your application and own the connections: AnyCable works with Rails,
Laravel, Node.js, Python, and any HTTP backend, implements
[presence](./anycable-go/presence.md),
[JWT authentication](./anycable-go/jwt_identification.md), and
[reliable streams](./anycable-go/reliable_streams.md) that restore missed
messages after a disconnect, and holds
[over 800,000 connections](https://anycable.io/compare/nodejs-websocket/) per
instance while application deploys leave live connections untouched.

## Key terms

The vocabulary of realtime systems, with each term defined so it can stand on
its own. These are the definitions used throughout the AnyCable documentation.

- A **WebSocket** is a connection that begins as an ordinary HTTP request and
  upgrades into a persistent, bidirectional channel, allowing the client and
  the server to send messages to each other at any time.
- **Server-Sent Events (SSE)** is a browser standard in which the server keeps
  an HTTP response open and pushes a one-directional stream of events to the
  client, suitable for feeds that never need to flow the other way.
- **Publish-subscribe (pub/sub)** is a messaging pattern that decouples senders
  from receivers: publishers send messages to named streams without knowing the
  audience, and a broker delivers each message to every subscriber of that
  stream.
- A **stream** is a named feed of messages, such as `chat/42`, that clients
  subscribe to and backends publish to; the stream name is the address that
  connects the two.
- A **broadcast** is the act of publishing one message to a stream so that
  every subscribed client receives its own copy.
- **At-most-once delivery** is the default semantics of a plain WebSocket and
  of most realtime tools, including Socket.IO and Pusher: each message is sent
  a single time, and a message published while a client's connection is broken
  is silently lost.
- **At-least-once delivery** guarantees that every message eventually reaches
  its subscriber, which the sender achieves by keeping each message until
  receipt is acknowledged and retrying when it is not; the price is that a
  receiver must tolerate an occasional duplicate. Socket.IO offers this as an
  opt-in through acknowledgments and its retries option.
- **Exactly-once delivery** guarantees that every message arrives, and arrives
  a single time, which requires deduplication on top of retries. Ably
  implements it by assigning every message a unique serial number, and
  AnyCable achieves it through its server and client SDK working together:
  every broadcast in a reliable stream carries an incrementing offset, and a
  reconnecting client resumes from the last offset it saw, with neither a gap
  nor a repeat.
- **Connection state recovery** is Socket.IO's name for restoring a briefly
  disconnected client's state, including its subscriptions and the events it
  missed; Ably calls the same idea resuming a connection, and AnyCable
  provides it through reliable streams backed by the server's stream history.
- A **reconnection avalanche** (also known as a thundering herd) happens when
  a restart or network incident disconnects thousands of clients at once and
  they all try to reconnect at the same moment, hitting the servers hardest
  exactly when they are weakest. Clients defend against it by reconnecting
  with exponential backoff and random jitter, which the AnyCable client SDK
  applies by default, and servers defend by spreading disconnects over the
  shutdown period, a mode AnyCable Pro calls slow drain.
- **[Presence](./anycable-go/presence.md)** is the live roster of clients
  subscribed to a stream, kept accurate through heartbeats and expiry, and
  delivered to applications as join and leave events.
- A **[signed stream](./anycable-go/signed_streams.md)** is a stream name
  accompanied by a cryptographic signature that the application generates with
  a secret key, letting a realtime server such as AnyCable authorize the
  subscription by verifying the signature instead of calling the application.
- **[RPC](./anycable-go/rpc.md)** (remote procedure call) is the integration
  mode in which the realtime server delegates decisions to the application:
  when a client connects, subscribes, or performs an action, AnyCable calls
  the application code and applies its verdict, which is how existing Rails
  Action Cable channels work with AnyCable unchanged.
- A **[reliable stream](./anycable-go/reliable_streams.md)** is a stream whose
  recent history the server retains, so that a client reconnecting after a
  network drop receives every message it missed, in the original order;
  paired with the AnyCable client SDK, it upgrades delivery from at-most-once
  to exactly-once.
- The **[broker](./anycable-go/broker.md)** is the component of a realtime
  server that keeps recent stream history and session state in a short-lived
  cache, turning a bare transport into a delivery system; AnyCable's built-in
  broker is what makes reliable streams and resumable sessions possible.
- A **[whisper](./js/presence.md)** is a message that one client sends directly
  to the other subscribers of a stream through the realtime server, without
  involving the backend application; typing indicators and live cursor
  positions are typical whispers.

## Where to go next

To see these concepts as working code, continue with the
[Quick Start](./quickstart.md), or read [What is AnyCable](./overview.md) and
[Capabilities](./capabilities.md) for how each guarantee is implemented.
