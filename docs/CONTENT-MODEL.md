# Community content model

The repository is a reviewed, static content source. OJ Insight reads `catalog.json`, then downloads an individual entry when someone opens it. Only merged content on `main` is published. A local save creates a copy; a catalog update never changes that copy.

## Layout and growth

| Directory | Content | Status |
| --- | --- | --- |
| `content/problem-sets/` | Fixed, shareable problem sets | v1 |
| `content/contest-presets/` | Reusable contest configurations | Reserved |
| `content/training-templates/` | Rules for personalized generation | Reserved |
| `content/learning-paths/` | Ordered collections of sets or templates | Reserved |

Every entry has a stable lowercase ID, a content type, author, license, summary, categories, and a nested type-specific manifest. A new content type needs its own schema, validator, catalog listing fields, and app support. Older apps ignore unknown types and schema versions.

## Review rules

Authors submit a PR. CI checks syntax, IDs, unique problem identities, links, and a regenerated catalog. A maintainer reviews teaching value, classification, attribution, and license before merging. A PR must not contain user account exports, submission history, private notes, cookies, local paths, or source code.

The initial deployment uses raw files from GitHub, not a server or user accounts. If the catalog grows too large, pagination or a versioned CDN index can be added without changing entry IDs or local copies. User ratings, favorites, and comments would need a separate moderation and identity design; they are outside this repository's v1 schema.
