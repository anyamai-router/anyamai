# AnyamAI — The open-source AI Router

Complete, self-hosted AI routing infrastructure built in Rust.

AnyamAI is **100% open source**, **self-hosted**, **free to use**, with **full source available** and **community-driven** development. It is a complete, ready-to-use AI Router — not just a framework.

## What it does

- **AI Gateway** — single OpenAI-compatible API
- **Multi-provider** — OpenAI, Anthropic, Gemini, Groq, DeepSeek, Ollama, and any OpenAI-compatible API
- **Intelligent routing** — priority, weighted, round-robin, lowest-cost, lowest-latency, health-aware, policy-based
- **Policy Engine** — hard constraints and preferences for deterministic routing
- **Fallback & retries** — automatic failover to next healthy route
- **Circuit breaker & health tracking** — latency, failures, availability per route
- **Auth & rate limiting** — API keys, authentication, secret redaction
- **Usage & cost tracking** — requests, tokens, estimated cost
- **Observability** — logging and per-decision explanations
- **PostgreSQL persistence**
- **Control Plane / Dashboard**
- **CLI & Docker deployment**

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT — see [LICENSE](https://github.com/anyamai/anyamai/blob/main/LICENSE).

## Links

- GitHub: https://github.com/anyamai/anyamai
- Docs: see `#developers` on the landing page
