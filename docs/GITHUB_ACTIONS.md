# GitHub Actions

Workflows live in `.github/workflows/`. Checkout, Node, Java, upload, and release actions are pinned to commit SHAs. The Android SDK is installed from Google's command-line tools, because the older setup action still requests the removed `tools` package and fails. Permissions are `contents: read` except the tagged release, which needs `contents: write` to publish the APK.

There is no schedule. Concurrency cancels a stale pull-request or manual build. A release is not cancelled by a second run on the same tag.

| Workflow | When it runs | What it does |
| --- | --- | --- |
| Pull request validation | pull request to `main` | `npm ci`, TypeScript check of `capacitor.config.ts`, lint and production build of the pinned client, PWA and API checks, `cap sync` |
| PWA validation | manual | Same frontend build and `scripts/validate.mjs`. Pull requests already run this, so it is not also triggered on every push. |
| Android APK | manual, `debug` or `release` | Frontend build, debug or signed release APK, `apksigner verify`, Actions artifact kept 14 days |
| Signed release APK | tag `v*.*.*` such as `v1.0.0` | Fails if signing secrets are missing. Otherwise signs, verifies, and publishes a GitHub Release. |

None of these workflows build the NestJS server or start the news pipeline.

## Minutes and storage

From GitHub's billing documentation, reviewed 13 Oct 2026:

- Standard GitHub-hosted runners are free for public repositories.
- A private repository on the Free plan includes 2,000 minutes a month and 500 MB of artifact storage for the account.
- Larger runners are billed even in public repositories. These workflows use `ubuntu-latest` only.

An Android build downloads the SDK and Gradle. That is the expensive job. Run it when you want an APK, not on every documentation edit. The pull-request job does not assemble an APK.

Debug artifacts expire after 14 days. They still count toward storage until then.

## Secrets for a signed build

Set the four secrets in [SECURITY.md](SECURITY.md) on `NaiduBugata/Media_Android`. The debug variant does not need them.
