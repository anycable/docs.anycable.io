# AnyCable+ CLI

[AnyCable+](https://plus.anycable.io) is the managed AnyCable service. The
`anycable-plus` command-line tool lets you provision and manage your _cables_
(hosted AnyCable servers) right from the terminal.

## Installation

```sh
curl -LSs https://anycable-plus.terminalwire.sh | bash
```

The script installs the CLI under `~/.terminalwire` and adds it to your PATH.
Restart your shell (or open a new terminal) and verify the installation:

```sh
anycable-plus --help
```

## Log in

```sh
anycable-plus login
```

This opens a browser window where you sign in to AnyCable+ via GitHub. The
session is stored on your machine; use `anycable-plus whoami` to check who you
are logged in as and `anycable-plus logout` to end the session.

## Create a cable

Create a hosted AnyCable server with a single command:

```sh
anycable-plus cable create my-app --public --wait
```

The `--wait` flag keeps the command running until the cable has finished
provisioning and prints its connection information:

```
Cable my-app is being provisioned
...

ID              42
Name            my-app
Status          created
WebSocket URL   wss://<your-cable-host>/cable
Broadcast URL   https://<your-cable-host>/_broadcast
Secret          none (public mode)
```

Point your client at the WebSocket URL and your backend at the broadcast URL,
and you have a working realtime setup; the [quick start](../quickstart.md)
shows the full round trip.

The `--public` flag creates a cable that accepts connections and broadcasts
without authentication, which is handy for prototyping (like running a local
server with `anycable-go --public`). For production, create a cable with a
secret instead and use [JWT authentication](../anycable-go/jwt_identification.md)
and [signed streams](../anycable-go/signed_streams.md); the
[quick start](../quickstart.md#secure-it) walks through both.

Other `cable create` options:

- `--secret=SECRET`: set the AnyCable secret (for JWT, signed streams, etc.).
- `--framework=FRAMEWORK`: adjust the default configuration to your backend
  framework (`rails`, `hotwire`, `js`, or `laravel`).
- `--rpc-host=RPC_HOST`: the URL of your backend for running channels
  (for the [Rails setup](../rails/getting_started.md)).

## Manage cables

List your cables:

```sh
anycable-plus cables
```

Print a cable's status and connection information (URLs, secret,
configuration):

```sh
anycable-plus cable info 42
```

Change the configuration, for example, rotate the secret (pass an empty
string to switch the cable to the public mode):

```sh
anycable-plus cable update 42 --secret=new-secret
```

Terminate and delete a cable (asks for confirmation unless you pass `-y`):

```sh
anycable-plus cable destroy 42 -y
```

## How it works

The CLI is a thin client for the AnyCable+ web application (built with
[Terminalwire](https://terminalwire.com)): commands are defined on the server
and their output is streamed to your terminal. You always have the latest
command set without reinstalling anything; the flip side is that every
command, including `--help`, requires network access (and most require being
logged in).

> Curious how a CLI-over-WebSocket works under the hood? Read the
> [Any Cables #34](https://blog.anycable.io/p/any-cables-34-cli-over-websocket)
> issue covering the AnyCable+ CLI architecture.
