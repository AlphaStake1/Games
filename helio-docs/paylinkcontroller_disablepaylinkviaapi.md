To disable a Pay Link, you can use the following API endpoint:

**Method:** `PATCH`
**URL:** `https://api.hel.io/v1/paylink/{id}/disable`

This action disables an active paylink, preventing any further payments from being made through it.

**Note:**

- For mainnet, set your Base URL to `https://api.hel.io` and generate API keys from `app.hel.io`.
- For testnet, use `https://api.dev.hel.io` and generate API keys from `app.dev.hel.io`.

Credentials typically use a Bearer token (JWT).
