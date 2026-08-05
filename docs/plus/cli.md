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

This opens a browser window where you sign in to AnyCable+ via GitHub. After
that, the CLI commands operate on your account.

## Create a cable

Create a hosted AnyCable server with a single command:

```sh
anycable-plus cable create my-app --public --wait
```

The `--wait` flag keeps the command running until the cable has finished
provisioning. The `--public` flag creates a cable that accepts connections
without authentication, which is handy for prototyping (like running a local
server with `anycable-go --public`). For production, secure your cable with
[JWT authentication](../anycable-go/jwt_identification.md) and [signed
streams](../anycable-go/signed_streams.md); the
[quick start](../quickstart.md#secure-it) walks through both.

## Exploring commands

The CLI is a thin client for the AnyCable+ web application (built with
[Terminalwire](https://terminalwire.com)): commands are defined on the server
and their output is streamed to your terminal. You always have the latest
command set without reinstalling anything; the flip side is that every
command, including `--help`, requires network access.

Use the built-in help to discover available commands and options:

```sh
anycable-plus --help
anycable-plus cable --help
```

> Curious how a CLI-over-WebSocket works under the hood? Read the
> [Any Cables #34](https://blog.anycable.io/p/any-cables-34-cli-over-websocket)
> issue covering the AnyCable+ CLI architecture.
