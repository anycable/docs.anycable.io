# Exceptions Handling

AnyCable captures all exceptions during your application code (i.e. your _channels_) execution.

The default behaviour is to log the exceptions with `"error"` level.

You can attach your own exceptions handler, for example, to send notifications somewhere (Honeybadger, Sentry, etc.):

```ruby
# with Honeybadger
AnyCable.capture_exception do |ex|
  Honeybadger.notify(ex)
end

# with Raven (Sentry)
AnyCable.capture_exception do |ex|
  Raven.capture_exception(ex)
end
```
