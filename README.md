# AnyCable documentation

AnyCable docs website driven by [`docsify`](https://docsify.js.org/#/).

## Contributing

The quickest way to fix a typo or propose a small change is to use GitHub web interface (open a file, click on "Edit", create a PR).

If you want to propose a bigger change, you might want to use a common flow:

1. Fork it.
1. Create a new branch (`git checkout -b feat/my-proposal`).
1. Commit and push changes.
1. Open new Pull Request.

### Linters

We try to keep our documentation both correct and _stylish_ using the following tools:

- [mdl](https://github.com/markdownlint/markdownlint)—Markdown linter, Ruby edition.
- [liche](https://github.com/raviqqe/liche)—links linter.
- [forspell](https://github.com/kkuprikov/forspell)—spelling checker.
- [rubocop]() with [rubocop-md]() and [standard]()—Ruby code snippets style checking.

To run these tools locally we use [Lefthook](https://github.com/Arkweid/lefthook) (runs linters automatically for every commit).

To sum up:

- Install `mdl`:

```sh
gem install mdl
```

- Install `liche`:

```sh
go get -u github.com/raviqqe/liche
```

- Install Hunspell and Forspell:

```sh
# for MacOS (for other OS see Forspell documentation)
brew install hunspell

gem install forspell
```

- Install StandardRB and `rubocop-md`:

```sh
gem install standard
gem install rubocop-md
```

- Install `lefthook`:

```sh
# for MacOS (for other OS see Lefthook documentation)
brew install lefthook
```

- Initialize `lefthook`:

```sh
lefthook install
```

Or you can skip all of these and rely on our CI, which can do all the checks for you!
