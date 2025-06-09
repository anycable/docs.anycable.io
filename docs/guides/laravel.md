# Using AnyCable with Laravel

<p class="preview-badge-header"></p>

AnyCable can be used as a WebSocket server for Laravel applications using Laravel Echo and Laravel Broadcasting capabilities. Consider it a drop-in replacement for Laravel Reverb, or Pusher, or whatever you use today.

Why choosing AnyCable over Reverb et al?

AnyCable is a battle-proofed real-time server that's been in production at scale for many years. It comes with extensive features set (reliability, various protocols support, observability tools, etc.) and it's **free to use**.

**NOTE:** Currently, this feature in the preview phase. There is some work in progress (see the limitations below).

## Getting Started

> Check out our demo Laravel application to see the complete example: [laravel-anycable-demo][]

First, install the [anycable-laravel][] library:

```sh
composer require anycable/laravel-broadcaster
```

Then, configure the application to use `anycable` broadcasting driver. For that, add the AnyCable service provider to the `bootstrap/providers.php` file:

```diff
 <?php

 return [
     App\Providers\AppServiceProvider::class,
     // ...
+    AnyCable\Laravel\Providers\AnyCableBroadcastServiceProvider::class,
 ];
```

Then, register the `anycable` driver in your `config/broadcasting.php` file:

```php
'anycable' => [
    'driver' => 'anycable',
],
```

AnyCable supports Pusher protocol, so your client-side code stays the same. For example:

```js
import Echo from "laravel-echo";

// We use Pusher protocol for now
import Pusher from "pusher-js";
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "reverb", // reverb or pusher would work
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
});
```

Just make sure you point to to the AnyCable server (locally it runs on the same host and port as Reverb).

Finally, install AnyCable server. We provide a convenient Artisan command that automatically downloads (when necessary) and runs the server:

```sh
php artisan anycable:server -- --pusher_app_key=my-app-key
```

The `--pusher_app_key` must be the same as the `VITE_REVERB_APP_KEY` for your client.
To use public channel, you must also provide the `--public_streams` flag. You can also create an `anycable.toml` configuration file (see [docs](/anycable-go/configuration?id=configuration-files)).

Alternatively, you can install AnyCable using [other available options](/anycable-go/getting_started?id=installation).

That's it! Run your Laravel application, launch AnyCable server, and you should see your Echo client connecting to it and receiving updates.

## Limitations

- Presence channels are yet to be implemented.

- Only HTTP broadcasting adapter for AnyCable is supported for now.

[anycable-laravel]: https://github.com/anycable/anycable-laravel
[laravel-anycable-demo]: https://github.com/anycable/laravel-anycable-demo
