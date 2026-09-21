use axum::extract::{Request, State};
use axum::http::header;
use axum::response::IntoResponse;
use axum::Json;
use serde_json::json;
use tracing::{debug, error, info};
use uuid::Uuid;

use anyamai_core::{AppError, ChatCompletionRequest};
use anyamai_db::queries;

use crate::auth;
use crate::error::AppErrorResponse;
use crate::server::AppState;

pub async fn health() -> impl IntoResponse {
    Json(json!({
        "status": "ok",
        "service": "anyamai-router",
        "version": env!("CARGO_PKG_VERSION"),
    }))
}

pub async fn chat_completions(
    State(state): State<AppState>,
    request: Request,
) -> Result<Json<anyamai_core::ChatCompletionResponse>, AppErrorResponse> {
    let request_id = Uuid::new_v4();
    let start = std::time::Instant::now();

    let auth_header = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("missing authorization header".into()))?;

    let raw_key = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Unauthorized("invalid authorization format".into()))?;

    let api_key = auth::authenticate_key(&state.db, raw_key)
        .await
        .map_err(AppErrorResponse)?;

    let body = axum::body::to_bytes(request.into_body(), 1024 * 1024)
        .await
        .map_err(|e| {
            AppErrorResponse(AppError::BadRequest(format!(
                "failed to read request body: {e}"
            )))
        })?;

    let completion_request: ChatCompletionRequest = serde_json::from_slice(&body).map_err(|e| {
        AppErrorResponse(AppError::BadRequest(format!("invalid request body: {e}")))
    })?;

    if completion_request.stream.unwrap_or(false) {
        return Err(AppErrorResponse(AppError::BadRequest(
            "streaming is not yet supported".into(),
        )));
    }

    let model_entry = state
        .models
        .resolve(&completion_request.model)
        .ok_or_else(|| {
            AppErrorResponse(AppError::ModelNotFound(completion_request.model.clone()))
        })?;

    let provider_name = &model_entry.provider;
    let provider = state.providers.get(provider_name).ok_or_else(|| {
        AppErrorResponse(AppError::ProviderError(format!(
            "provider not available: {provider_name}"
        )))
    })?;

    debug!(
        request_id = %request_id,
        model = %completion_request.model,
        provider = provider_name,
        "routing request"
    );

    let response = provider.complete(&completion_request).await;

    let latency = start.elapsed().as_millis() as i64;
    let status = if response.is_ok() { "success" } else { "error" };

    let _ = queries::log_request(
        &state.db,
        request_id,
        api_key.id,
        &completion_request.model,
        uuid::Uuid::nil(),
        status,
        response.as_ref().ok().map(|r| r.usage.prompt_tokens as i32),
        response
            .as_ref()
            .ok()
            .map(|r| r.usage.completion_tokens as i32),
        Some(latency),
    )
    .await;

    match response {
        Ok(resp) => {
            info!(
                request_id = %request_id,
                model = %resp.model,
                latency_ms = latency,
                "request completed"
            );
            Ok(Json(resp))
        }
        Err(e) => {
            error!(
                request_id = %request_id,
                error = %e,
                latency_ms = latency,
                "request failed"
            );
            Err(AppErrorResponse(e))
        }
    }
}

pub async fn list_models(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppErrorResponse> {
    let models: Vec<serde_json::Value> = state
        .models
        .available_models()
        .into_iter()
        .map(|m| {
            json!({
                "id": m.name,
                "object": "model",
                "owned_by": m.provider,
                "permission": [],
            })
        })
        .collect();

    Ok(Json(json!({
        "object": "list",
        "data": models,
    })))
}
