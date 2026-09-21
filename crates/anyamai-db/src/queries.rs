use sqlx::PgPool;

use anyamai_core::{ApiKey, Model, Provider, RequestLog};

pub async fn create_api_key(
    pool: &PgPool,
    name: &str,
    key_hash: &str,
    key_prefix: &str,
) -> Result<ApiKey, sqlx::Error> {
    sqlx::query_as::<_, ApiKey>(
        r#"
        INSERT INTO api_keys (name, key_hash, key_prefix)
        VALUES ($1, $2, $3)
        RETURNING id, key_hash, key_prefix, name, owner_id, revoked, expires_at, created_at
        "#,
    )
    .bind(name)
    .bind(key_hash)
    .bind(key_prefix)
    .fetch_one(pool)
    .await
}

pub async fn find_api_key_by_hash(
    pool: &PgPool,
    key_hash: &str,
) -> Result<Option<ApiKey>, sqlx::Error> {
    sqlx::query_as::<_, ApiKey>(
        r#"
        SELECT id, key_hash, key_prefix, name, owner_id, revoked, expires_at, created_at
        FROM api_keys
        WHERE key_hash = $1
        "#,
    )
    .bind(key_hash)
    .fetch_optional(pool)
    .await
}

pub async fn list_api_keys(pool: &PgPool) -> Result<Vec<ApiKey>, sqlx::Error> {
    sqlx::query_as::<_, ApiKey>(
        r#"
        SELECT id, key_hash, key_prefix, name, owner_id, revoked, expires_at, created_at
        FROM api_keys
        ORDER BY created_at DESC
        "#,
    )
    .fetch_all(pool)
    .await
}

pub async fn revoke_api_key(pool: &PgPool, key_id: uuid::Uuid) -> Result<bool, sqlx::Error> {
    let result = sqlx::query(
        r#"
        UPDATE api_keys SET revoked = TRUE WHERE id = $1
        "#,
    )
    .bind(key_id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected() > 0)
}

pub async fn create_provider(
    pool: &PgPool,
    name: &str,
    base_url: &str,
    api_key_env: &str,
    priority: i32,
) -> Result<Provider, sqlx::Error> {
    sqlx::query_as::<_, Provider>(
        r#"
        INSERT INTO providers (name, base_url, api_key_env, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, base_url, api_key_env, enabled, priority, created_at
        "#,
    )
    .bind(name)
    .bind(base_url)
    .bind(api_key_env)
    .bind(priority)
    .fetch_one(pool)
    .await
}

pub async fn list_providers(pool: &PgPool) -> Result<Vec<Provider>, sqlx::Error> {
    sqlx::query_as::<_, Provider>(
        r#"
        SELECT id, name, base_url, api_key_env, enabled, priority, created_at
        FROM providers
        ORDER BY priority DESC
        "#,
    )
    .fetch_all(pool)
    .await
}

pub async fn create_model(
    pool: &PgPool,
    name: &str,
    provider_id: uuid::Uuid,
    priority: i32,
    max_tokens: Option<i32>,
) -> Result<Model, sqlx::Error> {
    sqlx::query_as::<_, Model>(
        r#"
        INSERT INTO models (name, provider_id, priority, max_tokens)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, provider_id, enabled, priority, max_tokens, created_at
        "#,
    )
    .bind(name)
    .bind(provider_id)
    .bind(priority)
    .bind(max_tokens)
    .fetch_one(pool)
    .await
}

pub async fn list_models(pool: &PgPool) -> Result<Vec<Model>, sqlx::Error> {
    sqlx::query_as::<_, Model>(
        r#"
        SELECT id, name, provider_id, enabled, priority, max_tokens, created_at
        FROM models
        WHERE enabled = TRUE
        ORDER BY priority DESC
        "#,
    )
    .fetch_all(pool)
    .await
}

#[allow(clippy::too_many_arguments)]
pub async fn log_request(
    pool: &PgPool,
    request_id: uuid::Uuid,
    api_key_id: uuid::Uuid,
    model: &str,
    provider_id: uuid::Uuid,
    status: &str,
    prompt_tokens: Option<i32>,
    completion_tokens: Option<i32>,
    latency_ms: Option<i64>,
) -> Result<RequestLog, sqlx::Error> {
    sqlx::query_as::<_, RequestLog>(
        r#"
        INSERT INTO request_logs (request_id, api_key_id, model, provider_id, status, prompt_tokens, completion_tokens, latency_ms)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, request_id, api_key_id, model, provider_id, status, prompt_tokens, completion_tokens, latency_ms, created_at
        "#,
    )
    .bind(request_id)
    .bind(api_key_id)
    .bind(model)
    .bind(provider_id)
    .bind(status)
    .bind(prompt_tokens)
    .bind(completion_tokens)
    .bind(latency_ms)
    .fetch_one(pool)
    .await
}
