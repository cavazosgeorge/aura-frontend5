<!-- # Release Notes

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
*No new changes recorded yet.*

## [0.2.0] - 2025-03-30

### Added
- Initial setup of Release Notes page.
- Created dedicated Release Notes page (`/docs/release-notes.md`).
- Added Release Notes link to the main documentation sidebar.
- Implemented notification badge (`NEW`) for unread release notes in the sidebar, tracked via `localStorage`.

### Fixed
- Restored ability to manually toggle documentation sidebar accordion groups by clicking headers, while preserving auto-expansion based on current page route.

## [0.1.0] - 2025-03-30

### Added
- Documentation section with initial pages (Welcome, Getting Started, API, Tech Stack, Architecture).
- Sidebar navigation for documentation.
- Markdown rendering with styling for headings, lists, code blocks, etc.
- Documentation pagination (Previous/Next buttons).
- Sidebar auto-expansion based on active page.
- Adjusted layout padding for documentation content.

### Changed
- SVG rendering fixed in Architecture Overview.
- Footer layout adjusted to prevent overlap.
- Sidebar Accordion logic updated to handle external navigation and direct clicks.
- User search (`UserSearch.jsx`) results are now filtered based on the selected site scope.

### Fixed
- Resolved hook order issues in `DocumentationPage`.
- Corrected icon usage in `DocPagination` to use Feather icons.
- Fixed `/docs` base route redirection. -->


# Release Notes

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Custom `nginx.conf` file to handle React single-page application routing, redirecting all requests to `index.html`.
- Updated Dockerfile to include the custom `nginx.conf` in the production stage.

### Fixed
- Resolved 404 errors on page refresh for React routes by configuring Nginx to serve `index.html` for all unmatched routes.

## [0.2.0] - 2025-03-30

### Added
- Initial setup of Release Notes page.
- Created dedicated Release Notes page (`/docs/release-notes.md`).
- Added Release Notes link to the main documentation sidebar.
- Implemented notification badge (`NEW`) for unread release notes in the sidebar, tracked via `localStorage`.

### Fixed
- Restored ability to manually toggle documentation sidebar accordion groups by clicking headers, while preserving auto-expansion based on current page route.

## [0.1.0] - 2025-03-30

### Added
- Documentation section with initial pages (Welcome, Getting Started, API, Tech Stack, Architecture).
- Sidebar navigation for documentation.
- Markdown rendering with styling for headings, lists, code blocks, etc.
- Documentation pagination (Previous/Next buttons).
- Sidebar auto-expansion based on active page.
- Adjusted layout padding for documentation content.

### Changed
- SVG rendering fixed in Architecture Overview.
- Footer layout adjusted to prevent overlap.
- Sidebar Accordion logic updated to handle external navigation and direct clicks.
- User search (`UserSearch.jsx`) results are now filtered based on the selected site scope.

### Fixed
- Resolved hook order issues in `DocumentationPage`.
- Corrected icon usage in `DocPagination` to use Feather icons.
- Fixed `/docs` base route redirection.