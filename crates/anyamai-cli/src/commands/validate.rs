use tracing::{error, info};

use anyamai_core::AppConfig;

pub fn run(config_path: &str) -> anyhow::Result<()> {
    info!(path = config_path, "validating configuration");

    match AppConfig::load(config_path) {
        Ok(config) => match config.validate() {
            Ok(()) => {
                info!("configuration is valid");
                println!("Configuration is valid.");
                println!("  Server: {}:{}", config.server.host, config.server.port);
                println!("  Database: configured");
                println!("  Providers: {}", config.providers.len());
                println!("  Models: {}", config.models.len());
                for (name, model) in &config.models {
                    println!(
                        "    - {} (provider: {}, priority: {})",
                        name, model.provider, model.priority
                    );
                }
                Ok(())
            }
            Err(e) => {
                error!(error = %e, "configuration validation failed");
                eprintln!("Configuration validation failed: {e}");
                std::process::exit(1);
            }
        },
        Err(e) => {
            error!(error = %e, "failed to load configuration");
            eprintln!("Failed to load configuration: {e}");
            std::process::exit(1);
        }
    }
}
