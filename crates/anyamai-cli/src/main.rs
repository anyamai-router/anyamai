use clap::{Parser, Subcommand};

mod commands;

#[derive(Parser)]
#[command(name = "anyamai")]
#[command(about = "AnyamAI - Open-source AI Router")]
#[command(version)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Start {
        #[arg(short, long, default_value = "anyamai.toml")]
        config: String,
    },
    Validate {
        #[arg(short, long, default_value = "anyamai.toml")]
        config: String,
    },
    ApiKey {
        #[command(subcommand)]
        action: ApiKeyAction,
    },
    Migrate {
        #[arg(short, long, default_value = "anyamai.toml")]
        config: String,
    },
}

#[derive(Subcommand)]
enum ApiKeyAction {
    Create {
        #[arg(short, long)]
        name: String,
        #[arg(short, long, default_value = "anyamai.toml")]
        config: String,
    },
    List {
        #[arg(short, long, default_value = "anyamai.toml")]
        config: String,
    },
    Revoke {
        #[arg(short, long)]
        id: String,
        #[arg(short, long, default_value = "anyamai.toml")]
        config: String,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .init();

    let cli = Cli::parse();

    match cli.command {
        Commands::Start { config } => commands::start::run(&config).await,
        Commands::Validate { config } => commands::validate::run(&config),
        Commands::ApiKey { action } => match action {
            ApiKeyAction::Create { name, config } => {
                commands::api_key::create(&config, &name).await
            }
            ApiKeyAction::List { config } => commands::api_key::list(&config).await,
            ApiKeyAction::Revoke { id, config } => commands::api_key::revoke(&config, &id).await,
        },
        Commands::Migrate { config } => commands::migrate::run(&config).await,
    }
}
