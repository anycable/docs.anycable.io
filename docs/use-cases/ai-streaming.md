# Streaming AI responses

Streaming tokens from an LLM to the browser as they are generated is the
expected UX for AI products. It looks simple until you account for reality: a
long response takes tens of seconds, during which the user's connection can
blink, they can switch tabs, or they can reopen the conversation on another
device. If your transport is at-most-once, any token sent during a disconnect is
lost, and the user sees a response with a hole in it.

AnyCable solves this with [reliable streams](../anycable-go/reliable_streams.md):
tokens are ordered and replayable, so a client that drops mid-response catches up
on exactly what it missed.

## Architecture

```
  Browser  ◄── WebSocket (ordered tokens, auto catch-up) ──  AnyCable
                                                                ▲
                                                                │ POST /_broadcast
                                                                │ (one chunk per token/group)
  Your backend (Python / Node / any) ── calls LLM ─────────────┘
     streams tokens as they arrive
```

Your backend stays the only place that talks to the LLM. AnyCable owns the
connection to the browser. There is no persistent link between them: the backend
just POSTs each chunk over HTTP as it streams.

## 1. Run the server

For reliable, replayable delivery you need the [broker](../anycable-go/broker.md)
enabled. The `broker` preset does that:

```sh
anycable-go --presets=broker --broadcast_adapter=http --public
# --public is for local dev only (step 3 subscribes to an unsigned stream);
# in production, drop --public and use signed streams + JWT
```

## 2. Stream tokens from your backend

Pick a stream name per conversation, for example `ai/conversation/<id>`. As the
LLM yields tokens, broadcast each one (or small groups, to reduce HTTP overhead).

::: code-group

```python [Python]
import os, json, httpx

url = os.environ["ANYCABLE_BROADCAST_URL"]  # e.g. http://localhost:8090/_broadcast
stream = f"ai/conversation/{conversation_id}"

for chunk in llm.stream(prompt):           # your LLM client's streaming API
    httpx.post(url, json={"stream": stream, "data": json.dumps({"token": chunk.text})})
httpx.post(url, json={"stream": stream, "data": json.dumps({"done": True})})
```

```js [Node.js]
const url = process.env.ANYCABLE_BROADCAST_URL // http://localhost:8090/_broadcast

async function publish(stream, payload) {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stream, data: JSON.stringify(payload) }),
  })
}

const stream = `ai/conversation/${conversationId}`
for await (const chunk of llm.stream(prompt)) {  // your LLM client's streaming API
  await publish(stream, { token: chunk.text })
}
await publish(stream, { done: true })
```

:::

## 3. Render tokens on the client

Use the [AnyCable client SDK](https://github.com/anycable/anycable-client) with
the extended protocol so reconnection and catch-up happen automatically:

```js
import { createCable } from '@anycable/web'

const cable = createCable({ protocol: 'actioncable-v1-ext-json' })
const channel = cable.streamFrom(`ai/conversation/${conversationId}`)

let answer = ''
channel.on('message', (msg) => {
  if (msg.done) return finalize(answer)
  answer += msg.token          // append in arrival order
  render(answer)
})
```

That is the whole client. The SDK tracks the last offset it received; when the
connection drops and recovers, it requests the missed tokens and the server
replays them in order before resuming the live stream.

## Why this holds up

This scenario is verified against a running server. Streaming five tokens to a
stream, a connected client receives them in order:

```
1:The  2:quick  3:brown  4:fox  5:jumps
```

When a client drops after token 3 and reconnects, it requests history from
offset 3 and receives exactly the missed tokens, no gaps and no duplicates:

```
catch-up from offset 3 -> 4:fox  5:jumps  (+ confirm_history)
```

The same properties give you two more things for free:

- **Multiple viewers / multiple devices.** Anyone subscribed to the conversation
  stream sees the same tokens. Open the conversation on a second device and it
  catches up to the current state.
- **Survives your deploys.** Because AnyCable is a separate process, deploying
  your app mid-generation does not drop the user's stream. See
  [zero-downtime deploys](../capabilities.md#deploys).

## Production notes

- **Secure the streams.** Replace `--public` with [signed
  streams](../anycable-go/signed_streams.md) so a user can only subscribe to
  their own conversations, and authenticate connections with
  [JWT](../anycable-go/jwt_identification.md).
- **History window.** Tune `--history_limit` and `--history_ttl` to cover the
  longest plausible disconnect during a response. Defaults are 100 messages /
  300 seconds.
- **Chunking.** Broadcasting every single token is fine for moderate volumes;
  batch a few tokens per broadcast if you are generating very fast or serving
  many concurrent conversations.
- **Multi-node.** For more than one AnyCable instance, use a distributed broker
  (NATS, or Redis on [Pro](../pro.md)) so history is shared across nodes.

## Example apps

- [twilio-ai-js-demo](https://github.com/anycable/twilio-ai-js-demo) — Next.js app
  streaming an OpenAI Realtime voice agent over Twilio Media Streams and AnyCable.
- [twilio-ai-demo](https://github.com/anycable/twilio-ai-demo) — the same idea with
  a Ruby backend.

## Related

- [Reliable streams and resumable sessions](../anycable-go/reliable_streams.md)
- [Capabilities: delivery guarantees](../capabilities.md#delivery-guarantees)
- [Quick Start: any backend](../quickstart.md#any-backend)
