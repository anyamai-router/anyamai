use std::sync::Arc;

use axum::routing::{get, post};
use axum::Router;
use sqlx::PgPool;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::info;

use anyamai_core::{AppConfig, ModelRegistry};
use anyamai_provider::{openai::OpenAiProvider, ProviderRegistry};

use crate::routes;

#[derive(Clone)]
pub struct AppState {
    pub config: Arc<AppConfig>,
    pub db: PgPool,
    pub providers: Arc<ProviderRegistry>,
    pub models: Arc<ModelRegistry>,
}

pub async fn build_router(config: AppConfig, db: PgPool) -> anyhow::Result<Router> {
    let model_registry = ModelRegistry::from_config(&config.models);

    let mut provider_registry = ProviderRegistry::new();
    for (name, provider_config) in &config.providers {
        if provider_config.enabled {
            match config.provider_api_key(name) {
                Ok(api_key) => {
                    match OpenAiProvider::from_config(name, &provider_config.base_url, api_key) {
                        Ok(provider) => {
                            provider_registry.register(name.clone(), provider);
                            info!(provider = name, "registered provider");
                        }
                        Err(e) => {
                            tracing::warn!(provider = name, error = %e, "failed to create provider");
                        }
                    }
                }
                Err(e) => {
                    tracing::warn!(provider = name, error = %e, "provider API key not available");
                }
            }
        }
    }

    let state = AppState {
        config: Arc::new(config),
        db,
        providers: Arc::new(provider_registry),
        models: Arc::new(model_registry),
    };

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let router = Router::new()
        .route("/health", get(routes::health))
        .route("/v1/chat/completions", post(routes::chat_completions))
        .route("/v1/models", get(routes::list_models))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(state);

    Ok(router)
}
