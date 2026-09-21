use tracing::info;

use anyamai_core::AppConfig;
use anyamai_db::{create_pool, run_migrations};
use anyamai_router::server::build_router;

pub async fn run(config_path: &str) -> anyhow::Result<()> {
    info!(path = config_path, "loading configuration");

    let config = AppConfig::load_with_env(config_path)?;
    config.validate()?;

    info!(host = %config.server.host, port = config.server.port, "connecting to database");

    let pool = create_pool(&config.database.url, config.database.max_connections).await?;

    info!("running database migrations");
    run_migrations(&pool).await?;

    let router = build_router(config.clone(), pool).await?;

    let addr = format!("{}:{}", config.server.host, config.server.port);
    info!(addr = %addr, "starting server");

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, router).await?;

    Ok(())
}
