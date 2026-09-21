FROM rust:1.78-slim AS builder

RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY crates/ crates/

RUN cargo build --release --bin anyamai

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

RUN groupadd -r anyamai && useradd -r -g anyamai anyamai

WORKDIR /app

COPY --from=builder /app/target/release/anyamai /usr/local/bin/anyamai
COPY anyamai.toml /app/anyamai.toml

USER anyamai

EXPOSE 3000

ENTRYPOINT ["anyamai"]
CMD ["start"]
