pub mod mock;
pub mod openai;

use async_trait::async_trait;
use std::sync::Arc;

use anyamai_core::{AppError, ChatCompletionRequest, ChatCompletionResponse};

#[async_trait]
pub trait Provider: Send + Sync {
    fn name(&self) -> &str;

    async fn complete(
        &self,
        request: &ChatCompletionRequest,
    ) -> Result<ChatCompletionResponse, AppError>;
}

pub struct ProviderRegistry {
    providers: Vec<(String, Arc<dyn Provider>)>,
}

impl Default for ProviderRegistry {
    fn default() -> Self {
        Self::new()
    }
}

impl ProviderRegistry {
    pub fn new() -> Self {
        Self {
            providers: Vec::new(),
        }
    }

    pub fn register(&mut self, name: String, provider: Arc<dyn Provider>) {
        self.providers.push((name, provider));
    }

    pub fn get(&self, name: &str) -> Option<Arc<dyn Provider>> {
        self.providers
            .iter()
            .find(|(n, _)| n == name)
            .map(|(_, p)| Arc::clone(p))
    }

    pub fn list(&self) -> Vec<String> {
        self.providers.iter().map(|(n, _)| n.clone()).collect()
    }
}
