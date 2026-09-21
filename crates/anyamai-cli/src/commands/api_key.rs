use tracing::info;
use uuid::Uuid;

use anyamai_core::AppConfig;
use anyamai_db::{create_pool, queries};
use anyamai_router::auth::{generate_api_key, hash_api_key, key_prefix};

pub async fn create(config_path: &str, name: &str) -> anyhow::Result<()> {
    let config = AppConfig::load(config_path)?;
    let pool = create_pool(&config.database.url, config.database.max_connections).await?;

    let raw_key = generate_api_key();
    let hash = hash_api_key(&raw_key)?;
    let prefix = key_prefix(&raw_key);

    let api_key = queries::create_api_key(&pool, name, &hash, &prefix).await?;

    info!(key_id = %api_key.id, name = %name, "created API key");

    println!("API key created successfully.");
    println!("  ID:     {}", api_key.id);
    println!("  Name:   {}", api_key.name);
    println!("  Prefix: {}", api_key.key_prefix);
    println!();
    println!("IMPORTANT: Store this key securely. It will not be shown again.");
    println!("Key: {raw_key}");

    Ok(())
}

pub async fn list(config_path: &str) -> anyhow::Result<()> {
    let config = AppConfig::load(config_path)?;
    let pool = create_pool(&config.database.url, config.database.max_connections).await?;

    let keys = queries::list_api_keys(&pool).await?;

    if keys.is_empty() {
        println!("No API keys found.");
        return Ok(());
    }

    println!(
        "{:<38} {:<20} {:<12} {:<10}",
        "ID", "NAME", "PREFIX", "REVOKED"
    );
    println!("{}", "-".repeat(82));

    for key in &keys {
        println!(
            "{:<38} {:<20} {:<12} {:<10}",
            key.id,
            key.name,
            key.key_prefix,
            if key.revoked { "yes" } else { "no" }
        );
    }

    Ok(())
}

pub async fn revoke(config_path: &str, id_str: &str) -> anyhow::Result<()> {
    let config = AppConfig::load(config_path)?;
    let pool = create_pool(&config.database.url, config.database.max_connections).await?;

    let id = Uuid::parse_str(id_str).map_err(|_| anyhow::anyhow!("invalid UUID: {id_str}"))?;

    let revoked = queries::revoke_api_key(&pool, id).await?;

    if revoked {
        info!(key_id = %id, "revoked API key");
        println!("API key {id} has been revoked.");
    } else {
        eprintln!("API key {id} not found.");
        std::process::exit(1);
    }

    Ok(())
}
