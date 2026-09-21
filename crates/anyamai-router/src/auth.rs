use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use sqlx::PgPool;

use anyamai_core::{ApiKey, AppError};

pub fn hash_api_key(key: &str) -> Result<String, AppError> {
    let salt = SaltString::generate(&mut rand::thread_rng());
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(key.as_bytes(), &salt)
        .map_err(|e| AppError::Internal(format!("hash generation failed: {e}")))?;
    Ok(hash.to_string())
}

pub fn verify_api_key(key: &str, hash_str: &str) -> Result<bool, AppError> {
    let parsed_hash = PasswordHash::new(hash_str)
        .map_err(|e| AppError::Internal(format!("invalid hash format: {e}")))?;
    let argon2 = Argon2::default();
    Ok(argon2.verify_password(key.as_bytes(), &parsed_hash).is_ok())
}

pub fn generate_api_key() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let bytes: Vec<u8> = (0..32).map(|_| rng.gen()).collect();
    format!("am_{}", base64_encode(&bytes))
}

pub fn key_prefix(key: &str) -> String {
    if key.len() >= 8 {
        key[..8].to_string()
    } else {
        key.to_string()
    }
}

fn base64_encode(bytes: &[u8]) -> String {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut result = String::with_capacity((bytes.len() * 4).div_ceil(3));
    for chunk in bytes.chunks(3) {
        let b0 = chunk[0] as u32;
        let b1 = if chunk.len() > 1 { chunk[1] as u32 } else { 0 };
        let b2 = if chunk.len() > 2 { chunk[2] as u32 } else { 0 };
        let triple = (b0 << 16) | (b1 << 8) | b2;
        result.push(CHARS[((triple >> 18) & 0x3F) as usize] as char);
        result.push(CHARS[((triple >> 12) & 0x3F) as usize] as char);
        if chunk.len() > 1 {
            result.push(CHARS[((triple >> 6) & 0x3F) as usize] as char);
        }
        if chunk.len() > 2 {
            result.push(CHARS[(triple & 0x3F) as usize] as char);
        }
    }
    result
}

pub async fn authenticate_key(pool: &PgPool, raw_key: &str) -> Result<ApiKey, AppError> {
    let keys = anyamai_db::queries::list_api_keys(pool)
        .await
        .map_err(AppError::Database)?;

    for api_key in keys {
        if api_key.revoked {
            continue;
        }
        if let Ok(true) = verify_api_key(raw_key, &api_key.key_hash) {
            if let Some(expires_at) = api_key.expires_at {
                if expires_at < chrono::Utc::now() {
                    return Err(AppError::ApiKeyExpired);
                }
            }
            return Ok(api_key);
        }
    }

    Err(AppError::InvalidApiKey)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_api_key() {
        let key = generate_api_key();
        assert!(key.starts_with("am_"));
        assert!(key.len() > 10);
    }

    #[test]
    fn test_key_prefix() {
        assert_eq!(key_prefix("am_abcdefghijklmnop"), "am_abcde");
        assert_eq!(key_prefix("short"), "short");
    }

    #[test]
    fn test_hash_and_verify() {
        let key = generate_api_key();
        let hash = hash_api_key(&key).unwrap();
        assert!(verify_api_key(&key, &hash).unwrap());
    }

    #[test]
    fn test_verify_wrong_key() {
        let key = generate_api_key();
        let hash = hash_api_key(&key).unwrap();
        let wrong_key = generate_api_key();
        assert!(!verify_api_key(&wrong_key, &hash).unwrap());
    }
}
