# OJ Insight Community

Community content for [OJ Insight](https://github.com/Whalica/OJ_Insight). This repository holds reviewed, public content. Personal submissions, VP history, notes, and local code do not belong here.

## Publish a problem set

1. Export a problem set JSON from OJ Insight.
2. Sign in to GitHub and fork this repository. Open your fork, navigate to `content/problem-sets/`, and choose **Add file → Upload files**. Upload the JSON exported by OJ Insight without editing it. Its filename must be `<id>.json`, matching the `id` inside the file.
3. Commit the upload to a new branch. Choose **Contribute → Open pull request**, with `Whalica/OJ_Insight-Community` `main` as the base. GitHub Actions checks the entry. The maintainer reviews every PR before merging.

No LLM, local Node installation, or manual `catalog.json` edit is needed for a web submission. After an approved PR is merged, GitHub Actions regenerates and commits `catalog.json` on `main`, which makes the entry visible in OJ Insight. Maintainers can also run `node tools/catalog.mjs --write` locally if the publishing action cannot write to `main`.

Only publish material you created or have permission to redistribute. A problem-set entry may link to third-party problems; do not copy problem statements or another author's full description without permission. Never include credentials, private code, or personal training data.

`content/problem-sets/` is available now. `content/contest-presets/`, `content/training-templates/`, and `content/learning-paths/` are reserved for future schemas. OJ Insight ignores unsupported content types and schema versions.

The content types, review rules, and expansion path are documented in [the content model](docs/CONTENT-MODEL.md).

The reviewed `main` branch is the publication source. OJ Insight downloads `catalog.json` for browsing and fetches an entry only when opened. Saving creates an editable local copy; later community updates never overwrite it.
