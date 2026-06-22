# AnyCable documentation

Source for the [AnyCable documentation website](https://docs.anycable.io), built with [VitePress](https://vitepress.dev).

The Markdown content lives in [`docs/`](./docs).

## Running locally

You need [Node.js](https://nodejs.org) installed. Then, from the `docs/` directory:

```sh
cd docs

# Install dependencies
npm install

# Start the dev server with hot reload
npm run dev
```

Other available scripts:

- `npm run build`—build the static site into `docs/.vitepress/dist`.
- `npm run preview`—preview the production build locally.

## Contributing

The quickest way to fix a typo or propose a small change is to use the GitHub web interface (open a file, click on "Edit", create a PR).

If you want to propose a bigger change, you might want to use a common flow:

1. Fork it.
1. Create a new branch (`git checkout -b feat/my-proposal`).
1. Commit and push changes.
1. Open new Pull Request.

### Linters

We keep the documentation both correct and _stylish_ using the following tools:

- [mdl](https://github.com/markdownlint/markdownlint)—Markdown linter, Ruby edition.
- [lychee](https://github.com/lycheeverse/lychee)—links checker.
- [forspell](https://github.com/kkuprikov/forspell)—spelling checker.

These run automatically in CI for every pull request (see [`.github/workflows/docs-lint.yml`](./.github/workflows/docs-lint.yml)), so you can rely on CI to do the checks for you.
