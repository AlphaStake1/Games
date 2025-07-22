The content from `https://docs.hel.io/reference/overview-1` is as follows:

```
Jump to Content

HomeGuidesRecipesAPI Reference

----------------------------------------

Get Started
API Reference
Get Started

HomeGuidesRecipesAPI Reference

Overview
Search
All
Pages

START TYPING TO SEARCH…


JUMP TO


API

 * Getting Started


CURRENCY

 * Get Solana-Supported Currenciesget
   
 * Get All Currenciesget
   


PAY LINKS

 * Overview
 * Create a Pay Linkpost
   
 * Get a Pay Links Transactions by IDget
   
 * Update a Pay Linkpatch
   
 * Disable a Pay Linkpatch
   


TRANSACTIONS

 * Get Transactions by Pay Link IDget
   
 * Get a Transaction by Signatureget
   


SUBSCRIPTIONS

 * Overview
 * Get All Subscriptionsget
   
 * Get a Subscription by IDget
   


CHARGES

 * Overview
 * Create a Chargepost
   
 * Get a Charge by IDget
   


WEBHOOKS

 * Overview
 * Create a Webhookpost
   
 * Pay Links
   * Create a Pay Link Webhookpost
     
   * Get Webhooks for a Pay Linkget
     
   * Get a Pay Link Webhook by IDget
     
   * Delete a Pay Link Webhookdelete
     
 * Subscriptions
   * Create a Subscription Webhookpost
     
   * Get Webhooks for a Subscriptionget
     
   * Get a Subscription Webhook by IDget
     
   * Delete a Subscription Webhookdelete
     
 * Shopify Webhooks


ALLOWLIST

 * Add to a Wallet Allowlistpatch
   


MERCHANT ACCOUNT

 * Overview
 * Creating a Merchant Accountpost
   
 * Signing In to a Merchant Accountpost
   


EXPORTS

 * Export All Transactions From Your Accountget
   

Powered by 


OVERVIEW

Create single-use Pay Links and checkout sessions

"Charge pages" or "Charges" are an extended feature of Helio Pay Links that allow you to generate unique, single-use checkout pages from the same paylinkId. You can set the price dynamically via requestAmount.

Charges are optimal for mobile payment flows, deep-linking, QR codes, embedded pay buttons on simple websites like Wix, plugins to E-commerce baskets, or other custom payment flows.

USING ADDITIONALJSON IN YOUR REQUEST:

You can use the additionalJSON field within the customerDetails object to include any extra information you'd like to pass along with your payment request.

Example Request Body:

JSON

{
  "paymentRequestId": "66c49e24701f6930ee9c77dd",
  "requestAmount": "0.01",
  "prepareRequestBody": {
    "customerDetails": {
      "additionalJSON": "[]"
    }
  }
}

Example Query:

cURL

curl --location 'https://api.hel.io/v1/charge/api-key?apiKey=<YOUR_PUBLIC_API_KEY>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_SECRET_API_KEY' \
--data '{
    "paymentRequestId": "667974dbb38d45b726751902",
    "requestAmount": "0.2"
    "prepareRequestBody": {
    "customerDetails": {
      "additionalJSON": "[]" # or whatever json you want here.
    }
  }
}'

TRIGGER PAY WITH CARD VIA CHARGE

To trigger the Pay with Card flow directly from a charge page, simply append the query parameter ?cardonly=true to the end of the charge URL.

This will automatically launch the card payment flow without requiring the user to connect a Web3 wallet, which is useful for streamlining checkout for non-crypto users, enabling faster payments, or setting card as the default in your payment flow.

Example:

https://app.hel.io/charge/0f577645-b680-4d0a-8678-6fec0713ff3d?cardonly=true
```