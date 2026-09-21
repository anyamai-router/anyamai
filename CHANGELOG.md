# Changelog

All notable changes to AnyamAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Rust backend workspace with 5 crates (core, db, provider, router, cli)
- Axum HTTP server with `GET /health`, `POST /v1/chat/completions`, `GET /v1/models`
- PostgreSQL persistence with SQLx migrations (api_keys, providers, models, request_logs)
- Argon2 API key generation, hashing, verification, and revocation
- Bearer token authentication middleware
- `X-Request-ID` generation and propagation
- OpenAI-compatible provider abstraction trait
- Real OpenAI provider integration with pooled reqwest client
- Mock provider for testing
- Model registry with priority-based routing and round-robin
- CLI with subcommands: start, validate, api-key create/list/revoke, migrate
- Config system with TOML, environment variable expansion, and validation
- Dockerfile (multi-stage Rust build)
- Docker Compose with PostgreSQL and router services
- `.env.example` template
- GitHub Actions CI (fmt, clippy, test, lint, build)
- 17 unit tests across config, auth, model registry, and provider crates
- Landing page (Next.js 16, React 19, Tailwind v4, Motion)
- Open-source identity (MIT license, no commercial positioning)
- Comprehensive README with accurate project documentation

## [0.1.0] - Unreleased

Initial release with landing page and Rust router backend.
