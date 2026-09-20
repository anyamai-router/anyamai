# AnyamAI — The Open-Source AI Router

Complete, self-hosted AI routing infrastructure built in Rust.

AnyamAI is 100% open source, self-hosted, free to use, with full source available and community-driven development. It is designed to be a complete, ready-to-use AI Router — not just a framework — that you can run as core infrastructure in front of multiple AI providers.

> Current repository status: this repository currently contains the **marketing landing page** (Next.js). The Rust router, provider adapters, and control plane backend are on the roadmap and not yet implemented in this codebase. This README describes the intended product and how to work with the current codebase.

## Table of Contents

- [What is AnyamAI](#what-is-anyamai)
- [Why AnyamAI](#why-anyamai)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Roadmap](#roadmap)
- [API Overview (Planned)](#api-overview-planned)
- [Provider System (Planned)](#provider-system-planned)
- [Routing and Policy Engine (Planned)](#routing-and-policy-engine-planned)
- [Reliability and Observability (Planned)](#reliability-and-observability-planned)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

## What is AnyamAI

AnyamAI sits between your application and AI providers. Your application sends a single OpenAI-compatible request to AnyamAI, and AnyamAI routes it to the best upstream provider based on routing strategy, policy constraints, health, cost, and latency.

```
Your Application  -->  AnyamAI (AI Router)  -->  OpenAI / Anthropic / Gemini / Groq / DeepSeek / Ollama / Any OpenAI-compatible API
```

Goals:

- One OpenAI-compatible endpoint for all providers
- No application code changes when adding or switching providers
- Deterministic, explainable routing decisions
- Resilience under provider failure
- Full control over keys, data, and routing logic on your own infrastructure

## Why AnyamAI

Most teams start with one provider and later need to support several. Without a router, each provider adds API differences, key management, failure handling, and routing logic directly in application code.

AnyamAI centralizes that complexity:

- Normalize provider differences behind one API
- Define routing and fallback in one place
- Enforce cost, latency, region, and reliability constraints via policies
- Observe usage, cost, latency, and provider health in one control plane
- Keep credentials and traffic inside your own network

## Features

### Available today

- Marketing landing page (this repository)
- Design system with Tailwind v4, Geist fonts, and Motion
- Responsive documentation sections and interactive control plane preview

### Planned — product target

**AI Gateway**

- Single `POST /v1/chat/completions` endpoint, OpenAI-compatible
- Support for `/v1/embeddings` and `/v1/responses` (or explicit unsupported handling)
- Streaming via Server-Sent Events (SSE), including `data: [DONE]` and usage reporting

**Multi-Provider**

- OpenAI, Anthropic, Gemini, DeepSeek, Groq, xAI, OpenRouter, Ollama
- Generic OpenAI-compatible provider for any custom base URL
- Provider-specific request and response normalization
- Per-provider API key, base URL, timeout, and model mapping

**Intelligent Routing**

- Strategies: priority, weighted, round-robin, lowest-cost, lowest-latency, health-aware, policy-based
- Deterministic tie-breaking, concurrent-safe selection, and explainable decisions

**Policy Engine**

- Hard constraints and soft preferences
- Scoring, validation, versioning, activation and rollback
- Preview and simulation before activation

**Reliability**

- Timeouts, retries with exponential backoff and jitter, retry budget
- Fallback chain to next healthy route
- Circuit breaker with half-open probing and cooldowns
- Failure classification for 429, 4xx, 5xx, timeouts, and malformed responses

**Security**

- API key generation, hashing (Argon2), constant-time verification, revocation and expiration
- Admin API protection, rate limiting, secret redaction in logs

**Persistence**

- PostgreSQL for API keys, providers, models, policies, request logs, and usage aggregation
- Migrations, connection pooling, and bounded analytics queue

**Observability**

- Request IDs, structured logs, latency and provider metrics, routing and fallback counters, cost and usage metrics
- Planned Prometheus metrics endpoint and OpenTelemetry support

**Control Plane and Operations**

- Dashboard for providers, models, routes, policies, API keys, requests, usage, and health
- CLI for startup, config validation, provider inspection, and diagnostics
- Docker and Docker Compose deployment with health checks and graceful shutdown

See the `Roadmap` section for implementation order.

## Architecture Overview

Planned architecture (not yet implemented):

```
Client --> AnyamAI Router (Rust / Axum)
              |
              +--> Auth (API keys)
              +--> Rate Limiting
              +--> Policy Engine
              +--> Routing Engine
              +--> Provider Adapters ---> Upstream Providers
              +--> Observability (logs / metrics / traces)
              +--> PostgreSQL (persistence)
              +--> Control Plane API + Dashboard
```

Hot path for a request:

1. Authentication and rate limiting
2. Request ID assignment
3. Request parsing and validation
4. Policy evaluation
5. Route and candidate selection
6. Provider adapter execution
7. Upstream request with timeout handling
8. Response normalization and streaming
9. Usage and cost accounting
10. Analytics persistence (async, bounded)

## Tech Stack

**Current landing page:**

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion 13
- TypeScript 5

**Planned router (not yet in this repo):**

- Rust, Axum, Tokio
- reqwest (pooled HTTP client)
- PostgreSQL with sqlx
- Docker and Docker Compose

## Project Structure

```
anyam-ai/
  public/
    anyam.png
    logo.png
  src/
    app/
      layout.tsx        # Root layout, metadata, viewport, theme
      page.tsx          # Landing page assembly + JSON-LD
      globals.css       # Tailwind theme tokens and utilities
      robots.ts         # robots.txt generation
      sitemap.ts        # sitemap generation
    components/
      site-nav.tsx      # Fixed navigation with mobile dialog
      footer.tsx
      logo.tsx          # Logo using /logo.png
      reveal.tsx        # Scroll reveal helper (whileInView)
      motion-provider.tsx
      use-reduced-motion-safe.ts
      home/             # Landing sections (hero, problem, one-api, routing, bento, control-plane, etc.)
  package.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
```

There is no `src/app/api` backend, no Rust workspace, no Docker files, and no migrations yet. Those will be added according to the roadmap.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Run the landing page

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Other commands

```bash
npm run lint      # ESLint (next/core-web-vitals)
npm run build     # Production build (next build)
npm start         # Serve production build
npx tsc --noEmit  # Type check
```

## Configuration

The current codebase has no runtime configuration beyond Next.js. Environment variables are not required for the landing page.

Planned router configuration (not yet implemented) will include:

- `config/anyamai.example.toml` and `.env.example`
- Environment variable expansion for secrets
- Validation with safe defaults
- Documentation for provider credentials, timeouts, rate limits, and PostgreSQL connection

## Development

### Code style

- Use `next/font` for fonts (Geist, Geist Mono via `src/app/layout.tsx`)
- Styling with Tailwind v4 (`@tailwindcss/postcss`)
- Animations with `motion/react` (prefer over `framer-motion` legacy import)
- Client components must be isolated with `"use client"` at the top of the file
- Icons from `@phosphor-icons/react` (single family per page)

### Accessibility

- Skip link to `#main` in `src/app/layout.tsx`
- Visible focus rings (`:focus-visible` in `src/app/globals.css`)
- Navigation uses `aria-label`, mobile dialog uses `role="dialog"` and `Esc` handling

### Build verification

Before opening a pull request, run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Roadmap

This roadmap is dependency-aware. Each phase unlocks the next.

**Phase 0 — Scaffolding:** Rust workspace, Dockerfile, Docker Compose with PostgreSQL, example config, LICENSE file, CI workflow for fmt/clippy/test/lint/build.

**Phase 1 — Minimal viable router:** Config and migrations, API key auth, generic OpenAI-compatible provider adapter, `POST /v1/chat/completions` (non-streaming), static routing strategies, health endpoint, request IDs.

**Phase 2 — Reliability:** Timeouts, retries with backoff and budget, fallback chain, circuit breaker, fault-injection tests, and removal of `unwrap`/`expect` on the hot path.

**Phase 3 — Streaming and API surface:** SSE streaming for chat completions, embeddings and responses handling, tool calling and JSON mode passthrough, error normalization, Prometheus metrics.

**Phase 4 — Policy, models, and control plane:** Policy engine with validation, preview, versioning, and rollback; model registry with aliases and cost metadata; remaining providers via generic abstraction; real dashboard wiring.

**Phase 5 — Production hardening:** Postgres hardening, security headers, rate limiting, soak and chaos tests, benchmarks with regression gates, graceful shutdown.

## API Overview (Planned)

Base URL after self-hosting (example):

```
http://localhost:8080/v1
```

Planned endpoints:

- `POST /v1/chat/completions` — OpenAI-compatible chat completions, streaming and non-streaming
- `POST /v1/embeddings` — embeddings (or explicit unsupported error)
- `GET /health` — liveness and readiness
- `GET /metrics` — Prometheus metrics
- `POST /api/policies/simulate` — dry-run policy evaluation (control plane)

Requests use standard OpenAI JSON. Unsupported parameters will return a normalized 400 error instead of being silently ignored.

## Provider System (Planned)

Provider trait will normalize:

- Authentication (per-provider key and base URL)
- Request translation (messages, tools, response format, stream flag)
- Response translation (choices, usage, finish reason)
- Streaming frame translation (SSE or JSON stream to OpenAI SSE)
- Error mapping (401, 429 with Retry-After, 5xx, timeout, malformed body)
- Health signals (latency, error rate, consecutive failures)

Adding a new provider will mean implementing the same trait; no router core changes required.

## Routing and Policy Engine (Planned)

Routing will filter candidates by policy constraints, score by preferences (cost, latency, reliability, health), and select deterministically with documented tie-breaking. Concurrency safety, fairness for weighted and round-robin, and explainability (why a route was chosen) are required properties.

Policies will be versioned and activated atomically. In-flight requests will use the policy snapshot from request start. Validation will reject malformed policies before they affect traffic.

## Reliability and Observability (Planned)

Reliability targets:

- Per-provider timeouts and connection handling
- Retry only on retryable failures (429, 5xx, timeout) with capped budget
- Fallback to next healthy candidate, breaker opens on repeated failure, half-open probe recovers automatically
- Analytics queue is bounded and drops or fails open under backpressure, not unlimited in memory

Observability targets:

- `x-request-id` on every request and provider call
- Structured JSON logs with redacted secrets
- Metrics for requests, latency, provider health, retries, fallbacks, breaker state, and cost

## Contributing

AnyamAI is open source and contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Run `npx tsc --noEmit && npm run lint && npm run build` and ensure they pass
4. Open a pull request with a clear description and screenshots for UI changes

Please keep changes focused. For provider or routing changes, include tests with mocked upstream responses.

## License

MIT — see `LICENSE` on GitHub: https://github.com/anyamai-router/anyamai/blob/main/LICENSE

If a local `LICENSE` file is not yet present in this checkout, the MIT terms at the link above apply.

## Links

- GitHub: https://github.com/anyamai-router/anyamai
- Landing page sections: `Product` (`#product`), `Features` (`#features`), `Docs` (`#developers`), `Open Source` (`#pricing`)
- Issues and feature requests: use GitHub Issues on the repository above
