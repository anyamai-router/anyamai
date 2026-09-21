pub mod queries;

use sqlx::migrate::Migrator;
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::path::Path;

use anyamai_core::AppError;

pub async fn create_pool(database_url: &str, max_connections: u32) -> Result<PgPool, AppError> {
    PgPoolOptions::new()
        .max_connections(max_connections)
        .connect(database_url)
        .await
        .map_err(|e| AppError::Config(format!("failed to connect to database: {e}")))
}

pub async fn run_migrations(pool: &PgPool) -> Result<(), AppError> {
    let migrations_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("migrations");
    let migrator = Migrator::new(migrations_path)
        .await
        .map_err(|e| AppError::Config(format!("failed to load migrations: {e}")))?;
    migrator
        .run(pool)
        .await
        .map_err(|e| AppError::Config(format!("failed to run migrations: {e}")))?;
    Ok(())
}
