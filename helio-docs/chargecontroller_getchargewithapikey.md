The content from the provided page describes how to "Get a Charge by ID" using the Hel.io API.

Here's the relevant information:

*   **Endpoint:** `GET https://api.hel.io/v1/charge/{chargeId}`
*   **Description:** This endpoint allows you to retrieve a one-time charge using its unique identifier, `chargeId`.
*   **`chargeId`:** This is a unique identifier for the charge (e.g., `28936112-bcf1-4240-a851-85fb087c282a`). It can be found at the end of the URL when the charge is created.
*   **Response Details:** If the charge has been paid, transaction details will appear under the `paylinkTx` field in the response. If no transaction has occurred yet, this field will be returned as `"paylinkTx": null`.
*   **Base URLs:**
    *   **Mainnet:** `https://api.hel.io` (API keys from `app.hel.io`)
    *   **Testnet:** `https://api.dev.hel.io` (API keys from `app.dev.hel.io`)
*   **Credentials:** Bearer JWT (API Key).