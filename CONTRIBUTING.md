# Contributing to AnyamAI

Thank you for considering contributing to AnyamAI. This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch from `main`
4. Make your changes
5. Run all checks before submitting
6. Open a pull request

## Development Setup

### Prerequisites

- Rust 1.75+
- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm 10+

### Backend (Rust)

```bash
# Install dependencies and build
cargo build --workspace

# Run tests
cargo test --workspace

# Format code
cargo fmt --all

# Lint
cargo clippy --workspace --all-targets --all-features -- -D warnings
```

### Frontend (Next.js)

```bash
npm install
npm run dev          # Development server
npm run lint         # ESLint
npm run build        # Production build
npx tsc --noEmit     # Type check
```

### Database

```bash
# Start PostgreSQL with Docker
docker compose up postgres -d

# Run migrations
cargo run --bin anyamai -- migrate
```

## Before Submitting a Pull Request

All of the following must pass:

```bash
# Rust
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace

# Frontend
npm run lint
npm run build
```

## Pull Request Guidelines

- Keep changes focused and small
- Write clear commit messages
- Include tests for new functionality
- Update documentation if your change affects public APIs
- For UI changes, include screenshots
- For provider or routing changes, include tests with mocked upstream responses

## Code Style

### Rust

- Follow standard Rust conventions
- Use `cargo fmt` for formatting
- No `unwrap()` or `expect()` on production request paths
- No blocking I/O on hot paths
- No locks held across `.await`
- No per-request HTTP client construction
- No secrets in logs or error messages

### TypeScript

- Use `next/font` for fonts
- Styling with Tailwind v4
- Animations with `motion/react`
- Client components must have `"use client"` at the top
- Icons from `@phosphor-icons/react` (one family per page)

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include steps to reproduce for bugs
- Include your environment details (OS, Rust version, Node version)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
