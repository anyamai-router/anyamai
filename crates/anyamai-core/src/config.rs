use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::Path;

use serde::{Deserialize, Serialize};

use crate::error::AppError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub auth: AuthConfig,
    pub providers: HashMap<String, ProviderConfig>,
    pub models: HashMap<String, ModelConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    #[serde(default = "default_host")]
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    #[serde(default = "default_database_url")]
    pub url: String,
    #[serde(default = "default_max_connections")]
    pub max_connections: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthConfig {
    pub jwt_secret: String,
    #[serde(default = "default_argon_threads")]
    pub argon_threads: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderConfig {
    pub base_url: String,
    pub api_key_env: String,
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_priority")]
    pub priority: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelConfig {
    pub provider: String,
    #[serde(default)]
    pub enabled: bool,
    #[serde(default = "default_priority")]
    pub priority: i32,
    #[serde(default)]
    pub max_tokens: Option<u32>,
}

fn default_host() -> String {
    "0.0.0.0".into()
}
fn default_port() -> u16 {
    3000
}
fn default_database_url() -> String {
    "postgres://anyamai:anyamai@localhost:5432/anyamai".into()
}
fn default_max_connections() -> u32 {
    10
}
fn default_argon_threads() -> u32 {
    1
}
fn default_priority() -> i32 {
    0
}

impl AppConfig {
    pub fn load(path: &str) -> Result<Self, AppError> {
        let content = fs::read_to_string(path)
            .map_err(|e| AppError::Config(format!("failed to read config file: {e}")))?;
        let mut config: AppConfig = toml::from_str(&content)
            .map_err(|e| AppError::Config(format!("failed to parse config: {e}")))?;
        config.expand_env_vars()?;
        Ok(config)
    }

    pub fn load_with_env(path: &str) -> Result<Self, AppError> {
        let mut config = Self::load(path)?;
        if let Ok(db_url) = env::var("DATABASE_URL") {
            config.database.url = db_url;
        }
        if let Ok(jwt_secret) = env::var("JWT_SECRET") {
            config.auth.jwt_secret = jwt_secret;
        }
        Ok(config)
    }

    fn expand_env_vars(&mut self) -> Result<(), AppError> {
        self.database.url = expand_env(&self.database.url);
        self.auth.jwt_secret = expand_env(&self.auth.jwt_secret);
        for provider in self.providers.values_mut() {
            provider.api_key_env = expand_env(&provider.api_key_env);
        }
        Ok(())
    }

    pub fn validate(&self) -> Result<(), AppError> {
        if self.auth.jwt_secret.len() < 32 {
            return Err(AppError::Config(
                "jwt_secret must be at least 32 characters".into(),
            ));
        }
        if self.providers.is_empty() {
            return Err(AppError::Config(
                "at least one provider must be configured".into(),
            ));
        }
        if self.models.is_empty() {
            return Err(AppError::Config(
                "at least one model must be configured".into(),
            ));
        }
        for (name, model) in &self.models {
            if !self.providers.contains_key(&model.provider) {
                return Err(AppError::Config(format!(
                    "model '{name}' references unknown provider '{}'",
                    model.provider
                )));
            }
        }
        Ok(())
    }

    pub fn provider_api_key(&self, provider_name: &str) -> Result<String, AppError> {
        let provider = self
            .providers
            .get(provider_name)
            .ok_or_else(|| AppError::Config(format!("unknown provider: {provider_name}")))?;
        env::var(&provider.api_key_env).map_err(|_| {
            AppError::Config(format!(
                "environment variable {} not set for provider {provider_name}",
                provider.api_key_env
            ))
        })
    }
}

fn expand_env(s: &str) -> String {
    let mut result = s.to_string();
    for (key, value) in env::vars() {
        let pattern = format!("${{{key}}}");
        result = result.replace(&pattern, &value);
    }
    result
}

pub fn find_config_file() -> Option<String> {
    let candidates = [
        "anyamai.toml",
        "config/anyamai.toml",
        "/etc/anyamai/anyamai.toml",
    ];
    for candidate in &candidates {
        if Path::new(candidate).exists() {
            return Some(candidate.to_string());
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    #[test]
    fn test_default_values() {
        let config = AppConfig {
            server: ServerConfig {
                host: default_host(),
                port: default_port(),
            },
            database: DatabaseConfig {
                url: default_database_url(),
                max_connections: default_max_connections(),
            },
            auth: AuthConfig {
                jwt_secret: "a".repeat(32),
                argon_threads: default_argon_threads(),
            },
            providers: HashMap::new(),
            models: HashMap::new(),
        };
        assert_eq!(config.server.port, 3000);
        assert_eq!(config.database.max_connections, 10);
    }

    #[test]
    fn test_config_validation_short_secret() {
        let config = AppConfig {
            server: ServerConfig {
                host: "0.0.0.0".into(),
                port: 3000,
            },
            database: DatabaseConfig {
                url: "postgres://localhost/test".into(),
                max_connections: 5,
            },
            auth: AuthConfig {
                jwt_secret: "short".into(),
                argon_threads: 1,
            },
            providers: HashMap::new(),
            models: HashMap::new(),
        };
        assert!(config.validate().is_err());
    }

    #[test]
    fn test_config_validation_no_providers() {
        let config = AppConfig {
            server: ServerConfig {
                host: "0.0.0.0".into(),
                port: 3000,
            },
            database: DatabaseConfig {
                url: "postgres://localhost/test".into(),
                max_connections: 5,
            },
            auth: AuthConfig {
                jwt_secret: "a".repeat(32),
                argon_threads: 1,
            },
            providers: HashMap::new(),
            models: HashMap::new(),
        };
        assert!(config.validate().is_err());
    }

    #[test]
    fn test_config_roundtrip() {
        let toml_str = r#"
[server]
host = "127.0.0.1"
port = 8080

[database]
url = "postgres://user:pass@localhost/db"
max_connections = 20

[auth]
jwt_secret = "supersecretkeythatislongenough1234"
argon_threads = 2

[providers.openai]
base_url = "https://api.openai.com/v1"
api_key_env = "OPENAI_API_KEY"
enabled = true
priority = 1

[models.gpt-4o]
provider = "openai"
enabled = true
priority = 1
max_tokens = 4096
"#;
        let config: AppConfig = toml::from_str(toml_str).unwrap();
        assert_eq!(config.server.port, 8080);
        assert_eq!(config.providers.len(), 1);
        assert_eq!(config.models.len(), 1);
        assert!(config.validate().is_ok());

        let serialized = toml::to_string(&config).unwrap();
        let deserialized: AppConfig = toml::from_str(&serialized).unwrap();
        assert_eq!(deserialized.server.port, 8080);
    }

    #[test]
    fn test_expand_env() {
        env::set_var("TEST_ANYAMAI_VAR", "replaced");
        let result = expand_env("postgres://user:${TEST_ANYAMAI_VAR}@localhost/db");
        assert_eq!(result, "postgres://user:replaced@localhost/db");
        env::remove_var("TEST_ANYAMAI_VAR");
    }

    #[test]
    fn test_load_config_file() {
        let mut tmp = tempfile::NamedTempFile::new().unwrap();
        writeln!(
            tmp,
            r#"
[server]
host = "0.0.0.0"
port = 9999

[database]
url = "postgres://localhost/test"
max_connections = 5

[auth]
jwt_secret = "testsecretkeythatislongenough12345"

[providers.test]
base_url = "https://api.test.com/v1"
api_key_env = "TEST_KEY"
enabled = true

[models.test-model]
provider = "test"
enabled = true
"#
        )
        .unwrap();

        let config = AppConfig::load(tmp.path().to_str().unwrap()).unwrap();
        assert_eq!(config.server.port, 9999);
        assert!(config.validate().is_ok());
    }
}
