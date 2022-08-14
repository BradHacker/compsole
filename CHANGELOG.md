# Changelog

All notable changes to this project will be documented in this file.

> _Credit to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) for the format_

## [Unreleased]

### Added

- Admin main list pages
- User create/modify/change password form
- Update/Create form for:
  - Users
  - Competitions
  - Teams
  - Vm Objects
  - Providers
- UI to ingest VMs into Compsole

### Changed

- Providers are now own entity and Competitions can share a single provider
- Spiced up the README
- Providers now store config in database instead of using filesystem

### Deprecated

- Compsole CLI tool

### Removed

- Competition `ProviderType` and `ProviderConfigFile` fields

### Fixed

### Security

## [0.1.0] - 2022-07-11

### Added

- VM Lists (Team/Competition Scoped for standard users, Global for admin users)
- VM Console
- VM Controls
- Simple Authentication
