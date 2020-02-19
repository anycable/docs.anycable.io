# Heroku Deployment

## The Problem

Deploying applications using AnyCable on Heroku is a little bit tricky due to the following limitations:

- Missing HTTP/2 support.

AnyCable relies on HTTP/2 ('cause it uses [gRPC](https://grpc.io)).

- The only `web` service.

It is not possible to have two HTTP services within one application (only `web` service is open the world).

## The Workaround

The only way (for now) to run AnyCable applications on Heroku is to have two separate applications sharing some resources: the first one is a typical web application responsible for general HTTP and the second contains AnyCable WebSocket and RPC servers.

### Preparing the source code

We have to use the same `Procfile` for both applications ('cause we're using the same repo) but run different commands for the `web` service. That can be achieved through a custom script (from [this post](http://techtime.getharvest.com/blog/deploying-multiple-heroku-apps-from-a-single-repo)):

```sh
#!/bin/bash

if [ "$ANYCABLE_DEPLOYMENT" == "true" ]; then
  bundle exec anycable --server-command="anycable-go"
else
  bundle exec rails server -p $PORT -b 0.0.0.0
fi
```

Put this script, for example, into `bin/heroku-web` (and don't forget to `chmod +x`). Then in your `Procfile`:

```yml
web: bin/heroku-web
```

### Preparing Heroku apps

Here is the step-by-step guide on how to deploy AnyCable application on Heroku from scratch using [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).

First, we need to create an app for the _main_ application (skip this step if you already have a Heroku app):

```sh
# Create a new heroku application
$ heroku create example-app

# Add necessary add-ons
# NOTE: we need at least Redis
$ heroku addons:create heroku-postgresql
$ heroku addons:create heroku-redis

# Deploy application
$ git push heroku master

# Run migrations or other postdeployment scripts
$ heroku run "rake db:migrate"
```

Secondly, create a new Heroku application for the same repository to host the WebSocket server:

```sh
# Create a new application and name the git remote as "anycable"
$ heroku create example-app-anycable --remote anycable
```

Now we need to add `anycable-go` to this new app. There is a buildpack, [anycable/heroku-anycable-go](https://github.com/anycable/heroku-anycable-go), for that:

```sh
# Add anycable-go buildpack
$ heroku buildpacks:add https://github.com/anycable/heroku-anycable-go -a example-app-anycable
```

Also, to run RPC server ensure that you have a Ruby buildpack installed as well:

```sh
# Add ruby buildpack
$ heroku buildpacks:add heroku/ruby -a example-app-anycable
```

Now, **the most important** part: linking one application to another.

First, we need to link the shared Heroku resources (databases, caches, other add-ons).

Let's get a list of the main app add-ons:

```sh
# Get the list of the first app add-ons
$ heroku add-ons -a example-app
```

Find the ones you want to share with the AnyCable app and _attach_ them to it:

```sh
# Attach add-ons to the second app
$ heroku addons:attach postgresql-closed-12345 -a example-app-anycable
$ heroku addons:attach redis-regular-12345 -a example-app-anycable
```

**NOTE:** Make sure you have a Redis instance shared and the database as well. You might also want to share other add-ons depending on your configuration.

### Configuring the apps

Finally, we need to add the configuration variables to both apps.

For AnyCable app:

```sh
# Make our heroku/web script run `bundle exec anycable`
$ heroku config:set ANYCABLE_DEPLOYMENT=true -a example-app-anycable

# Don't forget to add RAILS_ENV if using Rails
$ heroku config:set RAILS_ENV=production -a anycable-demo-rpc
```

**IMPORTANT:** You also need to copy all (or most) the application-specific variables from
`example-app` to `example-app-anycable` to make sure that applications have the same environment.
For example, you must use the same `SECRET_KEY_BASE` if you're going to use cookies for authentication or
utilize some other encryption-related functionality in your channels code.

We recommend using Rails credentials (or alternative secure store implementation, e.g., [chamber](https://github.com/thekompanee/chamber)) to store the application configuration. This way you won't need to think about manual env syncing.

Next, we need to _tell_ the main app where to point Action Cable clients:

```ruby
# config/environments/production.rb
config.action_cable.url = "wss://#{ENV["CABLE_URL"]}"
```

And set the `CABLE_URL` var to point to the AnyCable endpoint in the AnyCable app:

```sh
# with the default Heroku domain
$ heroku config:set CABLE_URL="example-app-anycable.herokuapp.com/cable"

# or with a custom domain
$ heroku config:set CABLE_URL="anycable.example.com/cable"
```

**NOTE:** with default `.herokuapp.com` domains you won't be able to use cookies for authentication. Read more in [troubleshooting](../troubleshooting.md#my-websocket-connection-fails-with-quotauth-failedquot-error).

### Pushing code

Don't forget to push code to the AnyCable app every time you push the code to the main app:

```sh
git push anycable master
```

Alternatively, you can configure [automatic deployments](https://devcenter.heroku.com/articles/github-integration#automatic-deploys).

## Using with Heroku Review apps

Creating a separate AnyCable app for every Heroku review app seems to be an unnecessary overhead.

You can avoid this by using one of the following techniques.

### Use AnyCable Rack server

[AnyCable Rack](https://github.com/anycable/anycable-rack-server) server could be mounted into a Rack/Rails app and run from the same process and handle WebSocket clients at the same HTTP endpoint as the app.

On the other hand, it has the same architecture involving the RPC server, and thus provides the same experience as another, standalone, AnyCable implementations.

### Use Action Cable

You can use the _standard_ Action Cable in review apps with [enforced runtime compatibility checks](../ruby/compatibility.md#runtime-checks).

In your `cable.yml` use the following code to conditionally load the adapter:

```yml
production:
  adapter: <%= ENV.fetch('CABLE_ADAPTER', 'any_cable') %>
```

And set `"CABLE_ADAPTER": "redis"` (or any other built-in adapter, e.g. `"CABLE_ADAPTER": "async"`) in your `app.json`.

## Example

See complete example: [code](https://github.com/anycable/anycable_demo) and [deployed application](http://heroku-demo.anycable.io/).
