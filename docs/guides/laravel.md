# Using AnyCable with Laravel

AnyCable can be used as a WebSocket server for Laravel applications using Laravel Echo and Laravel Broadcasting capabilities. Consider it a drop-in replacement for Laravel Reverb, or Pusher, or whatever you use today.

Why choosing AnyCable over Reverb et al?

AnyCable is a battle-proofed real-time server that's been in production at scale for many years. It comes with extensive features set (reliability, various protocols support, observability tools, etc.) and it's **free to use**.

You can use AnyCable server in a [Pusher mode](/anycable-go/pusher.md) or _natively_ using a custom broadcasting and Echo adapter. In the latter, you can benefit from such AnyCable features as streams history and resumeable sessions (see [Reliable streams](/anycable-go/reliable_streams.md)).

## Pusher mode

Switching to AnyCable can be as simple as replacing the command to run a WebSocket server (if you use Reverb):

```sh
# before
$ REVERB_APP_ID=app-id \
REVERB_APP_KEY=app-key \
REVERB_APP_SECRET=app-secret \
php artisan reverb:start

# after
$ ANYCABLE_PUSHER_APP_ID=app-id \
ANYCABLE_PUSHER_APP_KEY=app-key \
ANYCABLE_SECRET=app-secret \
anycable-go
```

And that's it! AnyCable also runs on port 8080 by default, so no changes required.

> To give AnyCable a quick try, consider using our free managed service [AnyCable+](https://plus.anycable.io/cables).

To run AnyCable locally, you can use the [anycable-laravel][] package that provides the following command:

```sh
php artisan anycable:server
```

When running with this command, AnyCable automatically recognizes the following Reverb environment variables and uses them: `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`.

## AnyCable mode

> Check out our demo Laravel application to see the complete example: [laravel-anycable-demo][]

To fully benefit from AnyCable features, we recommend switching to use our [client library][anycable-client]. We also provide an Echo adapter that provides a familiar interface while using AnyCable JS SDK under the hood.

First, install the [anycable-laravel][] package and configure the broadcasting backend—you will need to authorize private and presence channels and publish events:

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

Now, install the `@anycable/echo` JS package and configure your Echo instance:

```js
import Echo from "laravel-echo";
import { EchoCable } from "@anycable/echo";

window.Echo = new Echo({
  broadcaster: EchoCable,
  cableOptions: {
    url: url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080/cable',
  },
  // other configuration options such as auth, etc
});
```

Finally, install AnyCable server. We provide a convenient Artisan command that automatically downloads (when necessary) and runs the server:

```sh
php artisan anycable:server
```

You can specify AnyCable configuration in the `.env` file:

- `ANYCABLE_SECRET=secret`
- `ANYCABLE_PUBLIC=true`: This MUST be set to true to allow connection (however, we highly recommend looking at the [JWT Authentication feature](/anycable-go/jwt_identification.md)).
- `ANYCABLE_PUBLIC_STREAMS=true`: Enables public channels—they're disabled by default.

You can also create an `anycable.toml` configuration file to fine-tune your AnyCable server (see [docs](/anycable-go/configuration?id=configuration-files)).

**NOTE:** The Artisan command automatically configures [AnyCable broadcasting adapter](/anycable-go/broadcasting.md) to HTTP and enables [the "broker" preset](/anycable-go/reliable_streams.md) (streams history).

Alternatively, you can install AnyCable using [other available options](/anycable-go/getting_started?id=installation).

That's it! Run your Laravel application, launch AnyCable server, and you should see your Echo client connecting to it and receiving updates.

## Benchmarks

You can find the benchmarks here: https://github.com/anycable/anycable-laravel/tree/master/benchmarks

**tl;dr** AnyCable shows slightly better performance and lesser memory usage during broadcast benchmarks compared to Reverb; however, AnyCable handles connection avalanches much better.

[anycable-laravel]: https://github.com/anycable/anycable-laravel
[laravel-anycable-demo]: https://github.com/anycable/larachat
[anycable-client]: https://github.com/anycable/anycable-client/tree/master/packages/echo
