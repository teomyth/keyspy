

## [1.0.5](https://github.com/teomyth/keyspy/compare/v1.0.4...v1.0.5) (2025-06-07)


### Features

* add intelligent cross-platform build system ([f77aeab](https://github.com/teomyth/keyspy/commit/f77aeabed447fec75f5b6b768a83470646e9afb0))
* add simplified version release scripts ([8865d88](https://github.com/teomyth/keyspy/commit/8865d884e392fc2829492806fce7d541db79d919))

* fix: correct YAML syntax in GitHub Actions workflow (e28e6bc)

## [1.0.3](https://github.com/teomyth/keyspy/compare/v1.0.2...v1.0.3) (2025-06-07)

* fix: ensure binaries upload to correct GitHub release (541cdec)

* fix: improve cross-platform compilation scripts (478ba51)

# 1.0.0 (2025-06-07)


### Bug Fixes

* **build:** resolve cross-platform compilation issues ([14d35ba](https://github.com/teomyth/keyspy/commit/14d35ba5fd33a1f39ea2fe0b1b01f5b3761bdac3))
* remove CHANGELOG.md from .gitignore for release-it ([cb47f7e](https://github.com/teomyth/keyspy/commit/cb47f7e3055c48f0004713ad530f91329fcf8c07))


### Features

* add comprehensive testing and examples ([635dc4d](https://github.com/teomyth/keyspy/commit/635dc4d4a3563f28e210da827141b1d285b6b107))
* add GitHub Actions for cross-platform binary compilation ([c5ee63d](https://github.com/teomyth/keyspy/commit/c5ee63dafce330823a7de55170bcdaeedb0b6a84))
* implement GitHub Releases + download-on-install architecture ([ace6e28](https://github.com/teomyth/keyspy/commit/ace6e287a83421d4e2a68d8041b950f24ceb41fd))
* modernize project toolchain ([7851dda](https://github.com/teomyth/keyspy/commit/7851dda9d83646b6c78f4a625cc4d4129fb3e1af))
* rebrand package as 'keyspy' ([77a9e80](https://github.com/teomyth/keyspy/commit/77a9e80d53f0382965d72900b1d49472bacb50bf))


### BREAKING CHANGES

* Binaries are now downloaded during npm install instead of being bundled

- Remove pre-compiled binaries from Git repository
- Add postinstall script to download platform-specific binaries from GitHub Releases
- Update GitHub Actions to package and upload binaries to releases
- Add comprehensive error handling and fallback options
- Update .gitignore to exclude downloaded binaries
- Add troubleshooting documentation

Benefits:
- ✅ Smaller NPM package size (no bundled binaries)
- ✅ Automatic platform detection and binary download
- ✅ Support for all Node.js versions (no compilation required)
- ✅ Fallback to manual build if download fails
- ✅ CI-friendly with KEYSPY_SKIP_DOWNLOAD environment variable

Installation flow:
1. npm install keyspy
2. Detects platform (darwin/linux/win32) and architecture
3. Downloads appropriate binary from GitHub Releases
4. Ready to use immediately

This follows the modern Node.js native module best practices used by
packages like sharp, sqlite3, and canvas.
