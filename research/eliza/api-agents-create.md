# ElizaOS V2 - Agent Creation API

**Source:** https://eliza.how/api-reference/agents/create-a-new-agent

## API Endpoint Details

- **Method:** POST
- **URL:** `/api/agents`
- **Content Type:** `application/json`

## Request Body Parameters

1. `characterPath`: String - Path to a character configuration file
2. `characterJson`: Object - Optional JSON configuration for the agent

## Example cURL Request

```bash
curl --request POST \
  --url http://localhost:3000/api/agents \
  --header 'Content-Type: application/json' \
  --data '{
    "characterPath": "<string>",
    "characterJson": {}
  }'
```

## Successful Response (201 Status)

```json
{
  "success": true,
  "data": {
    "character": {
      "id": "unique-agent-id",
      "name": "<string>",
      "bio": "<string>",
      "settings": {},
      "system": "<string>",
      "style": {},
      "lore": ["<string>"],
      "messageExamples": ["<string>"],
      "topics": ["<string>"],
      "plugins": ["<string>"]
    }
  }
}
```

## Key Characteristics of Agent Creation

- Generates a unique agent ID
- Allows configuration of agent personality, background, and capabilities
- Supports optional JSON configuration for advanced customization
- Returns detailed agent configuration upon successful creation

**Note:** Specific details about required fields in `characterPath` or `characterJson` are not explicitly defined in the documentation.
