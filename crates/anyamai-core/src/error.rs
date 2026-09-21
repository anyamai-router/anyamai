#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("authentication required")]
    Unauthorized(String),

    #[error("invalid API key")]
    InvalidApiKey,

    #[error("API key revoked")]
    ApiKeyRevoked,

    #[error("API key expired")]
    ApiKeyExpired,

    #[error("model not found: {0}")]
    ModelNotFound(String),

    #[error("provider error: {0}")]
    ProviderError(String),

    #[error("upstream request failed: {0}")]
    UpstreamError(String),

    #[error("rate limit exceeded")]
    RateLimited,

    #[error("invalid request: {0}")]
    BadRequest(String),

    #[error("database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("configuration error: {0}")]
    Config(String),

    #[error("internal error: {0}")]
    Internal(String),
}

impl From<anyhow::Error> for AppError {
    fn from(e: anyhow::Error) -> Self {
        AppError::Internal(format!("{e}"))
    }
}
