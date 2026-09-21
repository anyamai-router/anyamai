use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde_json::json;

use anyamai_core::AppError;

pub struct AppErrorResponse(pub AppError);

impl IntoResponse for AppErrorResponse {
    fn into_response(self) -> Response {
        let (status, message) = match &self.0 {
            AppError::Unauthorized(msg) => (StatusCode::UNAUTHORIZED, msg.clone()),
            AppError::InvalidApiKey => (StatusCode::UNAUTHORIZED, "invalid API key".into()),
            AppError::ApiKeyRevoked => {
                (StatusCode::UNAUTHORIZED, "API key has been revoked".into())
            }
            AppError::ApiKeyExpired => (StatusCode::UNAUTHORIZED, "API key has expired".into()),
            AppError::ModelNotFound(m) => (StatusCode::NOT_FOUND, format!("model not found: {m}")),
            AppError::ProviderError(msg) => (StatusCode::BAD_GATEWAY, msg.clone()),
            AppError::UpstreamError(msg) => (StatusCode::BAD_GATEWAY, msg.clone()),
            AppError::RateLimited => (StatusCode::TOO_MANY_REQUESTS, "rate limit exceeded".into()),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            AppError::Database(e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("database error: {e}"),
            ),
            AppError::Config(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("configuration error: {msg}"),
            ),
            AppError::Internal(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("internal error: {msg}"),
            ),
        };

        let body = json!({
            "error": {
                "message": message,
                "type": error_type(&status),
                "code": status.as_u16(),
            }
        });

        (status, axum::Json(body)).into_response()
    }
}

fn error_type(status: &StatusCode) -> &'static str {
    match status.as_u16() {
        401 => "authentication_error",
        404 => "not_found",
        429 => "rate_limit_error",
        502 => "upstream_error",
        _ => "api_error",
    }
}

impl From<AppError> for AppErrorResponse {
    fn from(e: AppError) -> Self {
        AppErrorResponse(e)
    }
}
