# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within AnyamAI, please send an email to the maintainers via GitHub Issues. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### What to include

When reporting a vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if applicable)

### Response timeline

- We will acknowledge receipt of your report within 48 hours
- We will provide an initial assessment within 7 days
- We will work with you to understand and address the issue
- We will release a fix as soon as possible

### What to expect

- We will keep you informed of our progress
- We will credit you in the release notes (unless you prefer to remain anonymous)
- We will not take legal action against researchers who report vulnerabilities in good faith

## Security Best Practices

When deploying AnyamAI, follow these security guidelines:

### Configuration

- Use environment variables for all secrets (`DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`)
- Never commit `.env` files or secrets to version control
- Use a strong, random `JWT_SECRET` (at least 32 characters)
- Rotate API keys regularly

### API Keys

- API keys are hashed with Argon2 before storage
- The raw key is shown only once at creation time
- Revoke compromised keys immediately using `anyamai api-key revoke`
- Use the最小权限 principle: only grant necessary access

### Network

- Run AnyamAI behind a reverse proxy (nginx, Caddy) in production
- Use TLS/SSL for all external connections
- Restrict database access to the application network only
- Consider running the database in a private network

### Database

- Use strong passwords for database users
- Enable PostgreSQL SSL connections in production
- Regular backups are recommended
- Monitor for unusual query patterns

### Logging

- Secrets are not logged in application logs
- Request IDs are included for audit trails
- Monitor logs for authentication failures
- Set up alerts for unusual traffic patterns

## Known Security Considerations

- This is early-stage software (v0.1.x). Audit before production use.
- The `POST /v1/chat/completions` endpoint forwards requests to upstream providers. Ensure your OpenAI API key has appropriate usage limits.
- Rate limiting is not yet implemented. Deploy behind a reverse proxy with rate limiting for production use.
- The policy engine is not yet implemented. Access control is limited to API key authentication.

## Updates

Security updates will be released as patch versions and announced in:
- GitHub Releases
- CHANGELOG.md

Subscribe to repository notifications to stay informed about security updates.
