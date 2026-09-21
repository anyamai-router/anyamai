use std::collections::HashMap;

use crate::config::ModelConfig;

#[derive(Debug, Clone)]
pub struct ModelEntry {
    pub name: String,
    pub provider: String,
    pub priority: i32,
    pub max_tokens: Option<u32>,
}

#[derive(Debug, Clone, Default)]
pub struct ModelRegistry {
    models: HashMap<String, ModelEntry>,
}

impl ModelRegistry {
    pub fn from_config(models: &HashMap<String, ModelConfig>) -> Self {
        let entries: HashMap<String, ModelEntry> = models
            .iter()
            .filter(|(_, m)| m.enabled)
            .map(|(name, m)| {
                (
                    name.clone(),
                    ModelEntry {
                        name: name.clone(),
                        provider: m.provider.clone(),
                        priority: m.priority,
                        max_tokens: m.max_tokens,
                    },
                )
            })
            .collect();
        Self { models: entries }
    }

    pub fn resolve(&self, model_name: &str) -> Option<&ModelEntry> {
        self.models.get(model_name)
    }

    pub fn available_models(&self) -> Vec<&ModelEntry> {
        let mut models: Vec<&ModelEntry> = self.models.values().collect();
        models.sort_by_key(|a| std::cmp::Reverse(a.priority));
        models
    }

    pub fn has_model(&self, model_name: &str) -> bool {
        self.models.contains_key(model_name)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::config::ModelConfig;

    fn test_models() -> HashMap<String, ModelConfig> {
        let mut models = HashMap::new();
        models.insert(
            "gpt-4o".into(),
            ModelConfig {
                provider: "openai".into(),
                enabled: true,
                priority: 2,
                max_tokens: Some(4096),
            },
        );
        models.insert(
            "gpt-3.5-turbo".into(),
            ModelConfig {
                provider: "openai".into(),
                enabled: true,
                priority: 1,
                max_tokens: Some(4096),
            },
        );
        models.insert(
            "disabled-model".into(),
            ModelConfig {
                provider: "openai".into(),
                enabled: false,
                priority: 0,
                max_tokens: None,
            },
        );
        models
    }

    #[test]
    fn test_registry_from_config() {
        let registry = ModelRegistry::from_config(&test_models());
        assert_eq!(registry.models.len(), 2);
        assert!(!registry.has_model("disabled-model"));
    }

    #[test]
    fn test_resolve() {
        let registry = ModelRegistry::from_config(&test_models());
        let entry = registry.resolve("gpt-4o").unwrap();
        assert_eq!(entry.provider, "openai");
        assert_eq!(entry.priority, 2);
    }

    #[test]
    fn test_resolve_unknown() {
        let registry = ModelRegistry::from_config(&test_models());
        assert!(registry.resolve("unknown-model").is_none());
    }

    #[test]
    fn test_available_models_sorted() {
        let registry = ModelRegistry::from_config(&test_models());
        let models = registry.available_models();
        assert_eq!(models.len(), 2);
        assert_eq!(models[0].name, "gpt-4o");
        assert_eq!(models[1].name, "gpt-3.5-turbo");
    }
}
