# OpenAI API Usage Overview — Football Squares dApp

**Doc URL**  <https://platform.openai.com/docs/>  
**Last Reviewed**  2025-07-08

---

## 1 . Why We Use OpenAI

| Agent                           | Model                | Purpose                                   |
|---------------------------------|----------------------|-------------------------------------------|
| **RandomizerAgent**             | `gpt-4.1`            | Build/verbalize VRF requests & sanity-check randomness results. |
| **OracleAgent**                 | `gpt-4.1`            | Parse Switchboard JSON, detect score anomalies. |
| **BoardAgent / WinnerAgent**    | `gpt-4.1`            | Convert board state to natural-language summaries for email/UX. |
| **OrchestratorAgent**           | **Anthropic** `claude-sonnet-4-20250514` *(not OpenAI)* | High-level planning / task routing. |

> **Rule:** we only call OpenAI for **deterministic text-processing helpers**; all orchestration logic lives with Claude Sonnet 4.

---

## 2 . Available Models (OpenAI side)

| Name        | Notes                       |
|-------------|-----------------------------|
| **`gpt-4.1`**      | Full-size, used when latency isn’t critical. |
| **`o4-mini`**      | Cheaper fallback (e.g., bulk score logs).    |
| **`o3`**           | Highest reasoning; reserve for audits.       |

---

## 3 . Basic TypeScript Call Pattern

```ts
import OpenAI from "openai";
import invariant from "tiny-invariant";

export async function callGPT(prompt: string): Promise<string> {
  invariant(process.env.OPENAI_API_KEY, "Missing OPENAI_API_KEY");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { choices } = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    response_format: { type: "json_object" } // structured output
  });

  return choices[0].message.content ?? "";
}

CURL Reference

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
        "model": "gpt-4.1",
        "messages": [
          {"role": "user", "content": "Summarise the current board state as JSON"}
        ],
        "response_format": {"type":"json_object"}
      }'

5 . Key Capabilities Used
Structured JSON outputs (board summaries, anomaly reports).

Function Calling to trigger local tools (randomizeBoard(), flagSuspiciousScore()).

Streaming for long score-log processing.

Batch API for retroactive game-day analytics.

Vision, audio, and code-interp endpoints are out of scope for this game.

6 . Authentication & Env Vars

# .env.example
OPENAI_API_KEY=sk-...
OPENAI_ORG=...

7 . Rate Limits & Best Practice
Practice	Implementation
Parallelism	Max 5 concurrent OpenAI calls.
Exponential back-off	Retry 429 after 2s,4s,8s.
Token budgeting	max_tokens tuned per agent.
Audit logging	All request/response IDs stored in Ceramic stream.

8 . Endpoint Cheat-Sheet
Endpoint	When We Use It
POST /chat/completions	Default text & tool-calling
POST /batch	Bulk post-game score digests
Legacy /completions	Not used

9 . Integration Considerations (TypeScript)
Use openai@4.x SDK (supports function-calling + streaming).

Always pass response_format: {type:"json_object"} for deterministic outputs.

Wrap calls in p-retry for automatic back-off.

Keep model names exact ("gpt-4.1", "o4-mini").

10 . Open Items
Benchmark o4-mini vs gpt-4.1 for VRF sanity-check latency.

Explore streaming to Proton email template directly (nice-to-have).

Remember: OpenAI is a supporting service. Core trust-minimized logic still happens on-chain (Anchor) and via Switchboard + Clockwork.


---