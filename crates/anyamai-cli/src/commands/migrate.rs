use tracing::info;

use anyamai_core::AppConfig;
use anyamai_db::{create_pool, run_migrations};

pub async fn run(config_path: &str) -> anyhow::Result<()> {
    let config = AppConfig::load(config_path)?;

    info!("connecting to database");
    let pool = create_pool(&config.database.url, config.database.max_connections).await?;

    info!("running migrations");
    run_migrations(&pool).await?;

    println!("Migrations completed successfully.");
    Ok(())
}
