The provided content describes the Hel.io API reference for webhooks. Here's a summary:

**Webhooks Overview:**

The Hel.io API allows you to create and manage webhooks for different purposes, including:

*   **Global Webhooks:** Created without a `paylinkId`.
*   **Pay Link Webhooks:** Specific to individual pay links.
*   **Subscription Webhooks:** Specific to subscriptions.
*   **Shopify Webhooks:** Mentioned as a category.

**Key Endpoints and Functionality:**

*   **Create a Webhook:**
    *   `POST https://api.hel.io/v1/webhook/paylink/api-key`
    *   Used to create either a global webhook (by omitting `paylinkId`) or a pay link-specific webhook.
*   **Pay Links Webhooks:**
    *   `POST` to create a Pay Link Webhook.
    *   `GET` to retrieve webhooks for a specific Pay Link.
    *   `GET` to retrieve a Pay Link Webhook by its ID.
    *   `DELETE` to remove a Pay Link Webhook.
*   **Subscriptions Webhooks:**
    *   `POST` to create a Subscription Webhook.
    *   `GET` to retrieve webhooks for a specific Subscription.
    *   `GET` to retrieve a Subscription Webhook by its ID.
    *   `DELETE` to remove a Subscription Webhook.

**Base URLs:**

*   **Mainnet:** `https://api.hel.io` (API keys from `app.hel.io`)
*   **Testnet:** `https://api.dev.hel.io` (API keys from `app.dev.hel.io`)

The API uses Bearer Token (JWT) for authentication.