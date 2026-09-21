use async_trait::async_trait;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::{debug, error};

use anyamai_core::{AppError, ChatCompletionRequest, ChatCompletionResponse};

use crate::Provider;

pub struct OpenAiProvider {
    name: String,
    base_url: String,
    api_key: String,
    client: Client,
}

#[derive(Debug, Serialize)]
struct OpenAiRequest {
    model: String,
    messages: Vec<OpenAiMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    temperature: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    top_p: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    max_tokens: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenAiMessage {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct OpenAiResponse {
    id: String,
    object: String,
    created: i64,
    model: String,
    choices: Vec<OpenAiChoice>,
    usage: OpenAiUsage,
}

#[derive(Debug, Deserialize)]
struct OpenAiChoice {
    index: u32,
    message: OpenAiMessage,
    finish_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
struct OpenAiUsage {
    prompt_tokens: u32,
    completion_tokens: u32,
    total_tokens: u32,
}

#[derive(Debug, Deserialize)]
struct OpenAiError {
    error: OpenAiErrorDetail,
}

#[derive(Debug, Deserialize)]
struct OpenAiErrorDetail {
    message: String,
    #[serde(rename = "type")]
    #[allow(dead_code)]
    error_type: Option<String>,
}

impl OpenAiProvider {
    pub fn new(name: String, base_url: String, api_key: String) -> Result<Self, AppError> {
        let client = Client::builder()
            .timeout(std::time::Duration::from_secs(120))
            .build()
            .map_err(|e| AppError::Config(format!("failed to build HTTP client: {e}")))?;

        Ok(Self {
            name,
            base_url,
            api_key,
            client,
        })
    }

    pub fn from_config(
        name: &str,
        base_url: &str,
        api_key: String,
    ) -> Result<Arc<dyn Provider>, AppError> {
        let provider = Self::new(
            name.to_string(),
            base_url.trim_end_matches('/').to_string(),
            api_key,
        )?;
        Ok(Arc::new(provider))
    }
}

#[async_trait]
impl Provider for OpenAiProvider {
    fn name(&self) -> &str {
        &self.name
    }

    async fn complete(
        &self,
        request: &ChatCompletionRequest,
    ) -> Result<ChatCompletionResponse, AppError> {
        let openai_request = OpenAiRequest {
            model: request.model.clone(),
            messages: request
                .messages
                .iter()
                .map(|m| OpenAiMessage {
                    role: m.role.clone(),
                    content: m.content.clone(),
                })
                .collect(),
            temperature: request.temperature,
            top_p: request.top_p,
            max_tokens: request.max_tokens,
        };

        let url = format!("{}/chat/completions", self.base_url);
        debug!(provider = %self.name, model = %request.model, "sending request to provider");

        let response = self
            .client
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&openai_request)
            .send()
            .await
            .map_err(|e| {
                error!(provider = %self.name, error = %e, "provider request failed");
                AppError::UpstreamError(format!("provider request failed: {e}"))
            })?;

        let status = response.status();
        let body = response.text().await.map_err(|e| {
            AppError::UpstreamError(format!("failed to read provider response: {e}"))
        })?;

        if !status.is_success() {
            let error: OpenAiError = serde_json::from_str(&body).unwrap_or(OpenAiError {
                error: OpenAiErrorDetail {
                    message: body.clone(),
                    error_type: None,
                },
            });
            error!(
                provider = %self.name,
                status = %status,
                message = %error.error.message,
                "provider returned error"
            );
            return Err(AppError::ProviderError(format!(
                "{}: {}",
                self.name, error.error.message
            )));
        }

        let openai_response: OpenAiResponse = serde_json::from_str(&body).map_err(|e| {
            error!(provider = %self.name, error = %e, "failed to parse provider response");
            AppError::ProviderError(format!("invalid provider response: {e}"))
        })?;

        debug!(
            provider = %self.name,
            model = %openai_response.model,
            prompt_tokens = openai_response.usage.prompt_tokens,
            completion_tokens = openai_response.usage.completion_tokens,
            "provider response received"
        );

        Ok(ChatCompletionResponse {
            id: openai_response.id,
            object: openai_response.object,
            created: openai_response.created,
            model: openai_response.model,
            choices: openai_response
                .choices
                .into_iter()
                .map(|c| anyamai_core::Choice {
                    index: c.index,
                    message: anyamai_core::ChatMessage {
                        role: c.message.role,
                        content: c.message.content,
                        name: None,
                    },
                    finish_reason: c.finish_reason,
                })
                .collect(),
            usage: anyamai_core::Usage {
                prompt_tokens: openai_response.usage.prompt_tokens,
                completion_tokens: openai_response.usage.completion_tokens,
                total_tokens: openai_response.usage.total_tokens,
            },
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_provider_creation() {
        let provider = OpenAiProvider::new(
            "test".into(),
            "https://api.openai.com/v1".into(),
            "sk-test".into(),
        );
        assert!(provider.is_ok());
        let p = provider.unwrap();
        assert_eq!(p.name(), "test");
    }

    #[test]
    fn test_provider_name() {
        let provider = OpenAiProvider::new(
            "openai".into(),
            "https://api.openai.com/v1".into(),
            "sk-test".into(),
        )
        .unwrap();
        assert_eq!(provider.name(), "openai");
    }
}
