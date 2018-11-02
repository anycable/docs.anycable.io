# Action Cable Compatibility

This compatibility table shows which Action Cable features supported by `anycable` gem (AnyCable servers may not support some of the features supported by gem).

Feature                  | Status 
-------------------------|--------
Connection Identifiers   | ✅
Connection Request (cookies, params) | ✅
Disconnect Handling | ✅
Subscribe to channels | ✅
Parameterized subscriptions | ✅
Unsubscribe from channels | ✅
[Subscription Instance Variables](http://edgeapi.rubyonrails.org/classes/ActionCable/Channel/Streams.html) | 🚫
Performing Channel Actions | ✅
Streaming | ✅
[Custom stream callbacks](http://edgeapi.rubyonrails.org/classes/ActionCable/Channel/Streams.html) | 🚫
Broadcasting | ✅
Periodical Timers | 🚫
Disconnect remote clients | 🚧

## Runtime checks

AnyCable provides a way to enforce compatibility through runtime checks.

Runtime checks are monkey-patches which raise exceptions (`AnyCable::CompatibilityError`) when AnyCable-incompatible code is called.

To enabled runtime checks add the following file to your configuration (e.g. `config/<env>.rb` or `config/initializers/anycable.rb`):

```ruby
require "anycable/rails/compatibility"
```

**NOTE:** compatibility checks could be used with Action Cable (i.e. w/o AnyCable) and don't affect compatible functionality; thus it makes sense to add runtime checks in development and test environments.

## Static checks

AnyCable integrates with [RuboCop](https://github.com/rubocop-hq/rubocop) to detect incompatible code in your application.

Add to your `.rubocop.yml`:

```yml
- require: "anycable/rails/compatibility/cops"
# ...
```

And run `rubocop`:

```sh
$ bundle exec rubocop app/channels

#=> TODO: add example output
```
