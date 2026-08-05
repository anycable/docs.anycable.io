# TypeScript and testing

Type your channels so mistakes fail at compile time, and unit-test channel
logic without a server.

## Type your channels

Add type constraints for channel params, incoming messages, custom events, and
performable actions:

```ts
// ChatChannel.ts
import { Channel, ChannelEvents } from '@anycable/web'

type Params = {
  roomId: string | number
}

type TypingMessage = {
  type: 'typing'
  username: string
}

type ChatMessage = {
  type: 'message'
  username: string
  userId: string
}

type Message = TypingMessage | ChatMessage

interface Events extends ChannelEvents<Message> {
  typing: (msg: TypingMessage) => void
}

interface Actions {
  speak: (msg: ChatMessage) => void
  typing: () => void
}

export class ChatChannel extends Channel<Params, Message, Events, Actions> {
  static identifier = 'ChatChannel'

  receive(message: Message) {
    if (message.type === 'typing') {
      return this.emit('typing', message)
    }

    super.receive(message)
  }
}
```

The compiler now catches mistakes in params, events, and actions:

```ts
let channel = new ChatChannel({ roomId: '2021' }) //=> OK
channel = new ChatChannel({ room_id: '2021' }) //=> compile error: incorrect params key

channel.on('typing', (msg: TypingMessage) => {}) //=> OK
channel.on('types', (msg: TypingMessage) => {}) //=> compile error: unknown event

channel.perform('speak', { type: 'message', username: 'John', userId: '42' }) //=> OK
channel.perform('speak', { body: 'hello!' }) //=> compile error: incorrect message type
channel.perform('type') //=> compile error: unknown action
```

## Test channels with TestCable

`@anycable/core/testing` provides a test cable implementation that records
performed actions instead of sending them to a server. Given a channel:

```js
import { Channel } from '@anycable/core'

export class ChatChannel extends Channel {
  static identifier = 'ChatChannel'

  async speak(message) {
    return this.perform('speak', { message })
  }

  leave() {
    return this.disconnect()
  }
}
```

Test its outgoing actions and disconnect behavior (Jest shown; any runner
works):

```js
import { ChatChannel } from './channel.js'
import { TestCable } from '@anycable/core/testing'

describe('ChatChannel', () => {
  let channel
  let cable

  beforeEach(() => {
    cable = new TestCable()
    channel = new ChatChannel()
    cable.subscribe(channel)
  })

  it('performs a speak action', async () => {
    await channel.speak('hello')
    await channel.speak('bye')

    expect(cable.outgoing).toEqual([
      { action: 'speak', payload: { message: 'hello' } },
      { action: 'speak', payload: { message: 'bye' } }
    ])
  })

  it('disconnects on leave', () => {
    channel.leave()

    expect(channel.state).toEqual('closed')
  })
})
```

For integration-style tests against a real server, disable reconnection
(`createCable({ monitor: false })`) so failures surface immediately instead of
retrying in the background.

## Read next

- [AnyCable JS SDK overview](../guides/client-side.md)
- [Reliable connections on the client](./reliability.md)
