# Changelog

All notable changes to this project will be documented in this file.

> _Credit to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) for the format_

## [v1.1-beta] - 2023-02-09

### Added

- Admin UI to view logs
- Mass creation of team users
- 3rd-party application REST API
- VM Lockout
  - Added lockout button to VM Object form
  - Mass lockout VM's by regex/search
- Option to skip importing VM on ingestion
- VM Object power state
  - Providers can get vm power state
  - Display on console page
  - Control console visibility based on power state

### Removed

- Sign up page

### Fixed

- Admin table cacheing issues (see #17)
- VM Object Form (see #20)
- UI bugs (see #22)
- Fix cannot delete users (see #26)
- Responsive console page for small resolution displays (see #39)

### Security

- REST API api token + refresh token workflows
- Logging for all GraphQL queries/mutations

## [v1.0-beta] - 2022-11-04

### Added

- Admin main list pages
- User create/modify/change password form
- Update/Create form for:
  - Users
  - Competitions
  - Teams
  - Vm Objects
  - Providers
- Add delete operations for:
  - Users
  - Competitions
  - Teams
  - Vm Objects
  - Providers
- UI to ingest VMs into Compsole
  - Auto-sort VM's into teams
- Dockerized entire application (Frontend/Backend/Database/Redis)
- Websocket-based GraphQL Subscriptions
- Fullscreen console option
- Account settings page
  - First + Last name change
  - Self-service password change

### Changed

- Providers are now own entity and Competitions can share a single provider
- Spiced up the README
- Providers now store config in database instead of using filesystem

### Deprecated

- Compsole CLI tool

### Removed

- Competition `ProviderType` and `ProviderConfigFile` fields

## [0.1.0] - 2022-07-11

### Added

- VM Lists (Team/Competition Scoped for standard users, Global for admin users)
- VM Console
- VM Controls
- Simple Authentication
