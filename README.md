# AnyamAI — The Open-Source AI Router

Complete, self-hosted AI routing infrastructure built in Rust.

AnyamAI is 100% open source, MIT-licensed, self-hosted, and free to use. It is designed to be a complete, ready-to-use AI Router that you can run as core infrastructure in front of multiple AI providers.

## What is AnyamAI

AnyamAI sits between your application and AI providers. Your application sends a single OpenAI-compatible request to AnyamAI, and AnyamAI routes it to the best upstream provider based on routing strategy, health, and priority.

```
Your Application  -->  AnyamAI (AI Router)  -->  OpenAI / Anthropic / Gemini / Groq / DeepSeek / Ollama / Any OpenAI-compatible API
```

**Goals:**

- One OpenAI-compatible endpoint for all providers
- No application code changes when adding or switching providers
- Deterministic, explainable routing decisions
- Full control over keys, data, and routing logic on your own infrastructure

## Features

### Available today

- `POST /v1/chat/completions` — OpenAI-compatible chat completions (non-streaming)
- `GET /health` — liveness check
- `GET /v1/models` — list available models
- Bearer token authentication with Argon2-hashed API keys
- `X-Request-ID` generation and propagation
- Priority routing and round-robin model selection
- PostgreSQL persistence with SQLx migrations
- Generic OpenAI-compatible provider abstraction
- Real OpenAI provider integration
- CLI for start, config validation, API key management, and migrations
- Docker + Docker Compose deployment with PostgreSQL
- GitHub Actions CI (fmt, clippy, test, lint, build)
- Landing page (Next.js 16, React 19, Tailwind v4, Motion)

### Not yet implemented

- Streaming (SSE)
- `/v1/embeddings` and `/v1/responses`
- Anthropic, Gemini, DeepSeek, Groq, xAI, Ollama provider adapters
- Policy engine (rate limiting, model allowlists, constraints)
- Circuit breaker and advanced retry/fallback
- Prometheus/OpenTelemetry observability
- Dashboard backend

## Tech Stack

**Router (Rust):**

- Rust 1.75+
- Axum (HTTP framework)
- Tokio (async runtime)
- SQLx (PostgreSQL, runtime-checked queries)
- reqwest (pooled HTTP client for upstream providers)
- Argon2 (API key hashing)
- clap (CLI)
- tracing / tracing-subscriber (structured logging)

**Landing page (TypeScript):**

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Motion (Framer Motion)
- TypeScript 5
- @phosphor-icons/react

## Project Structure

```
anyam-ai/
  crates/
    anyamai-core/          # Config, types, errors, model registry
    anyamai-db/            # PostgreSQL migrations and queries
    anyamai-provider/      # Provider trait, OpenAI adapter, mock provider
    anyamai-router/        # Axum server, auth, routes, middleware
    anyamai-cli/           # CLI binary (start, validate, api-key, migrate)
  src/                     # Next.js landing page
    app/                   # App Router pages and layout
    components/            # UI components (nav, hero, sections, etc.)
  public/                  # Static assets (logo, etc.)
  anyamai.toml             # Example router configuration
  Cargo.toml               # Rust workspace
  docker-compose.yml       # PostgreSQL + router
  Dockerfile               # Multi-stage Rust build
  .env.example             # Environment variables template
  .github/workflows/ci.yml # GitHub Actions CI
```

## Getting Started

### Prerequisites

- Rust 1.75+
- Node.js 20+
- PostgreSQL 16+
- Docker (optional, for containerized deployment)

### Run with Docker Compose

```bash
cp .env.example .env
# Edit .env and set OPENAI_API_KEY
docker compose up
```

The router will be available at `http://localhost:3000`.

### Run locally

```bash
# 1. Start PostgreSQL (or use Docker)
docker compose up postgres -d

# 2. Set environment variables
export DATABASE_URL=postgres://anyamai:anyamai@localhost:5432/anyamai
export JWT_SECRET=your-secret-key-at-least-32-chars
export OPENAI_API_KEY=sk-your-key

# 3. Run migrations
cargo run --bin anyamai -- migrate

# 4. Create an API key
cargo run --bin anyamai -- api-key create --name "my-key"

# 5. Start the server
cargo run --bin anyamai -- start
```

### Run the landing page

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configuration

Router configuration is in `anyamai.toml`:

```toml
[server]
host = "0.0.0.0"
port = 3000

[database]
url = "${DATABASE_URL}"
max_connections = 10

[auth]
jwt_secret = "${JWT_SECRET}"

[providers.openai]
base_url = "https://api.openai.com/v1"
api_key_env = "OPENAI_API_KEY"
enabled = true
priority = 1

[models.gpt-4o]
provider = "openai"
enabled = true
priority = 2
max_tokens = 4096

[models.gpt-4o-mini]
provider = "openai"
enabled = true
priority = 1
max_tokens = 4096
```

Environment variables are expanded with `${VAR_NAME}` syntax. The database URL and JWT secret should always come from environment variables.

## CLI

```bash
# Start the server
anyamai start [--config anyamai.toml]

# Validate configuration
anyamai validate [--config anyamai.toml]

# API key management
anyamai api-key create --name "my-key"
anyamai api-key list
anyamai api-key revoke --id <uuid>

# Run database migrations
anyamai migrate [--config anyamai.toml]
```

## API

### `GET /health`

```json
{
  "status": "ok",
  "service": "anyamai-router",
  "version": "0.1.0"
}
```

### `POST /v1/chat/completions`

OpenAI-compatible request:

```bash
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Authorization: Bearer am_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### `GET /v1/models`

Lists all enabled models with their providers.

## Architecture

```
Client --> AnyamAI Router (Axum)
              |
              +--> Bearer Auth (Argon2 verification)
              +--> Request ID generation
              +--> Model registry lookup
              +--> Provider selection (priority routing)
              +--> OpenAI-compatible provider adapter
              +--> Upstream provider (reqwest, pooled)
              +--> Response normalization
              +--> Request logging (PostgreSQL)
```

## Development

### Rust

```bash
cargo fmt --all -- --check   # Format check
cargo clippy -D warnings      # Lint
cargo test --workspace        # Tests
cargo build --workspace       # Build
```

### Frontend

```bash
npm run lint                  # ESLint
npm run build                 # Production build
npx tsc --noEmit              # Type check
```

## Roadmap

**Phase 1 (current):** Minimal viable router with config, auth, OpenAI provider, non-streaming completions, health endpoint, request IDs, priority/round-robin routing.

**Phase 2:** Streaming (SSE), Anthropic/Gemini/DeepSeek/Groq adapters, circuit breaker, retry with backoff, fallback chains.

**Phase 3:** Policy engine, model registry with cost metadata, rate limiting, Prometheus/OpenTelemetry.

**Phase 4:** Dashboard backend, embeddings, responses API, advanced routing strategies.

**Phase 5:** Production hardening, chaos tests, benchmarks, security audit.

## Contributing

AnyamAI is open source and contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Run all checks before submitting:
   - `cargo fmt --all -- --check && cargo clippy -D warnings && cargo test --workspace`
   - `npm run lint && npm run build`
4. Open a pull request with a clear description

For provider or routing changes, include tests with mocked upstream responses.

## License

MIT — see [LICENSE](https://github.com/anyamai-router/anyamai/blob/main/LICENSE)

## Links

- GitHub: https://github.com/anyamai-router/anyamai
- Issues: https://github.com/anyamai-router/anyamai/issues
