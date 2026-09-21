use async_trait::async_trait;
use std::sync::Arc;

use anyamai_core::{
    AppError, ChatCompletionRequest, ChatCompletionResponse, ChatMessage, Choice, Usage,
};

use crate::Provider;

pub struct MockProvider {
    name: String,
}

impl MockProvider {
    pub fn create(name: &str) -> Arc<dyn Provider> {
        Arc::new(Self {
            name: name.to_string(),
        })
    }
}

#[async_trait]
impl Provider for MockProvider {
    fn name(&self) -> &str {
        &self.name
    }

    async fn complete(
        &self,
        request: &ChatCompletionRequest,
    ) -> Result<ChatCompletionResponse, AppError> {
        let response_text = format!(
            "Mock response for model '{}' with {} message(s)",
            request.model,
            request.messages.len()
        );

        let prompt_tokens = request
            .messages
            .iter()
            .map(|m| m.content.len() as u32 / 4)
            .sum::<u32>()
            .max(1);
        let completion_tokens = response_text.len() as u32 / 4;

        Ok(ChatCompletionResponse {
            id: format!("mock-{}", uuid::Uuid::new_v4()),
            object: "chat.completion".into(),
            created: chrono::Utc::now().timestamp(),
            model: request.model.clone(),
            choices: vec![Choice {
                index: 0,
                message: ChatMessage {
                    role: "assistant".into(),
                    content: response_text,
                    name: None,
                },
                finish_reason: Some("stop".into()),
            }],
            usage: Usage {
                prompt_tokens,
                completion_tokens,
                total_tokens: prompt_tokens + completion_tokens,
            },
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use anyamai_core::ChatMessage;

    #[tokio::test]
    async fn test_mock_provider_returns_response() {
        let provider = MockProvider::create("mock");
        let request = ChatCompletionRequest {
            model: "test-model".into(),
            messages: vec![ChatMessage {
                role: "user".into(),
                content: "Hello".into(),
                name: None,
            }],
            temperature: None,
            top_p: None,
            max_tokens: None,
            stream: None,
        };

        let response = provider.complete(&request).await.unwrap();
        assert_eq!(response.choices.len(), 1);
        assert!(response.choices[0].message.content.contains("test-model"));
        assert!(response.usage.total_tokens > 0);
    }

    #[tokio::test]
    async fn test_mock_provider_multiple_messages() {
        let provider = MockProvider::create("mock");
        let request = ChatCompletionRequest {
            model: "gpt-4o".into(),
            messages: vec![
                ChatMessage {
                    role: "system".into(),
                    content: "You are helpful".into(),
                    name: None,
                },
                ChatMessage {
                    role: "user".into(),
                    content: "Hi".into(),
                    name: None,
                },
            ],
            temperature: None,
            top_p: None,
            max_tokens: None,
            stream: None,
        };

        let response = provider.complete(&request).await.unwrap();
        assert!(response.choices[0].message.content.contains("2 message(s)"));
    }
}
