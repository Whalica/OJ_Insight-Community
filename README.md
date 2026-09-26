# OJ Insight Community

Community content for [OJ Insight](https://github.com/Whalica/OJ_Insight). This repository holds reviewed, public content. Personal submissions, VP history, notes, and local code do not belong here.

## Publish a problem set

1. Export a problem set JSON from OJ Insight.
2. Copy `examples/problem-set.json` to `content/problem-sets/<stable-id>.json` and replace its `content` with the exported JSON. Set a stable lowercase `id`, a short `summary`, your `author`, `categories`, and a license you have the right to grant.
3. Run `node tools/catalog.mjs --write` and commit both the entry and `catalog.json` in a pull request. GitHub Actions checks the result. The maintainer reviews every PR before merging.

Only publish material you created or have permission to redistribute. A problem-set entry may link to third-party problems; do not copy problem statements or another author's full description without permission. Never include credentials, private code, or personal training data.

`content/problem-sets/` is available now. `content/contest-presets/`, `content/training-templates/`, and `content/learning-paths/` are reserved for future schemas. OJ Insight ignores unsupported content types and schema versions.

The content types, review rules, and expansion path are documented in [the content model](docs/CONTENT-MODEL.md).

The reviewed `main` branch is the publication source. OJ Insight downloads `catalog.json` for browsing and fetches an entry only when opened. Saving creates an editable local copy; later community updates never overwrite it.
