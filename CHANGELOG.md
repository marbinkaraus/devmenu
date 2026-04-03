# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.4](https://github.com/marbinkaraus/devmenu/compare/v1.0.3...v1.0.4) (2026-04-03)


### Bug Fixes

* **ci:** use plain v* tags for release-please ([05d1443](https://github.com/marbinkaraus/devmenu/commit/05d1443b5ad86986842c8de24b022efdbf9eaf6f))

## [1.0.3](https://github.com/marbinkaraus/devmenu/compare/v1.0.2...v1.0.3) (2026-04-03)

### Added
- Test suite with `bun test` for core modules (config, search, templates).
- Config parser now warns on unrecognized fields to help catch typos.
- `CONTRIBUTING.md` for new contributors.
- `CHANGELOG.md`.
- Publish workflow now auto-creates GitHub releases on tag push.

### Fixed
- README images now render correctly on npmjs.com (absolute URLs).
- Search screen no longer quits when typing `q` in the filter input.
- Node version requirement is consistently documented as >=20 across all files.
- `RELEASING.md` accurately describes runtime dependencies.

### Changed
- Removed deprecated `preferGlobal` from `package.json`.
- Pinned `@types/bun` to `^1.3.11` for reproducible installs.

## [1.0.2] - 2026-04-03

### Fixed
- Removed `media/` from npm tarball to reduce package size.
- Fixed anchor links in README.

## [1.0.1] - 2026-04-03

### Fixed
- Added `cfonts` to runtime dependencies (was missing; required by `ink-big-text`).
- Fixed CI release workflow.
- Fixed broken link in README.

## [1.0.0] - 2026-04-03

### Added
- Initial release: TUI for browsing and running categorized shell commands.
- YAML and JSON config support with upward directory discovery.
- Category and command picker screens with vim-style navigation.
- Full-text search across labels, commands, and tags.
- Input collection with `{{placeholder}}` templating.
- Confirm step with custom messages for destructive commands.
- Dedicated Git commit screen with subject/body fields.
- `devmenu init` to scaffold starter config from shipped examples.
- Alternate screen buffer management.
- `--help` and `--version` CLI flags.
