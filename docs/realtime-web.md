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

To see these concepts as working code, continue with the
[Quick Start](./quickstart.md), or read [What is AnyCable](./overview.md) and
[Capabilities](./capabilities.md) for how each guarantee is implemented.
