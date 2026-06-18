# Affiliate AI OS

Affiliate AI OS is a lightweight SaaS foundation for managing affiliate campaigns, products, affiliate links, and future AI-assisted content workflows.

The project is currently at Phase 1.5 Hardening: the Phase 1 CRUD foundation remains intact, while database access, validation, errors, logging, environment checks, and AI provider access have been moved behind clearer application layers.

## Tech Stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui-style components
- Supabase Auth
- Supabase PostgreSQL
- Server Actions
- Zod
- ESLint
- Prettier

## Architecture

Application writes now follow this path:

```text
UI
↓
Server Actions
↓
Services
↓
Repositories
↓
Supabase
```

- UI components and routes render forms, tables, and pages.
- Server Actions handle auth context, redirects, and cache invalidation.
- Services own business orchestration, validation, typed error handling, and logging.
- Repositories own Supabase reads and writes only.
- Supabase remains protected by RLS policies from the Phase 1 migration.

## Setup

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for protected app flows. AI provider keys are optional at app startup and required only when that provider is selected for a real request.

## Supabase Setup

1. Create a Supabase project.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
3. Run the SQL migration in `supabase/migrations/202606080001_phase_1_foundation.sql`.
4. Confirm email/password auth is enabled in Supabase Auth settings.
5. For easiest local testing, disable email confirmation or confirm the test user email manually.

## Database

The Phase 1 migration creates:

- `profiles`
- `campaigns`
- `products`
- `affiliate_links`
- `contents`
- `ai_jobs`

Row Level Security is enabled on all tables. Policies restrict user-owned records to `auth.uid() = user_id`, with `profiles` scoped to `auth.uid() = id`. The migration also includes `updated_at` triggers and a profile bootstrap trigger for new Supabase Auth users.

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Routes

- `/login`
- `/register`
- `/dashboard`
- `/campaigns`
- `/campaigns/new`
- `/campaigns/[id]`
- `/products`
- `/products/new`
- `/products/[id]`
- `/links`
- `/settings`
- `/settings/ai-test`

## AI Layer Design

AI provider access is centralized through `src/lib/services/ai.service.ts`:

```text
AI Service
├─ DeepSeek: real text generation through src/lib/ai/deepseek.ts
├─ OpenAI: real text generation through src/lib/ai/openai.ts
└─ Gemini: mocked Phase 1.5 response
```

Future product, content, and automation features should call `generateText(...)` from `ai.service.ts` instead of importing provider modules directly.

```ts
await generateText({
  provider: "deepseek",
  prompt: "Analyze this product...",
});

await generateText({
  provider: "openai",
  prompt: "Review this generated content...",
  temperature: 0.4,
  maxTokens: 600,
});
```

DeepSeek supports:

- `DEEPSEEK_API_KEY`
- configurable `DEEPSEEK_MODEL`, defaulting to `deepseek-chat`
- request timeout
- retry support
- typed success/error response shape

OpenAI supports:

- `OPENAI_API_KEY`
- configurable `OPENAI_MODEL`, defaulting to `gpt-4o-mini`
- request timeout
- retry support
- typed success/error response shape

Gemini text generation remains mocked until its real workflow is approved.

## Provider Selection Strategy

Use DeepSeek for:

- high-volume generation
- product analysis
- SEO drafts
- captions
- cheap batch jobs

Use OpenAI for:

- quality review
- premium rewriting
- final polish
- image generation later

Use Gemini later for:

- long context
- image/video analysis

## AI Playground

The route `/settings/ai-test` verifies provider behavior before Product Hunter work begins.

Features:

- Provider selector for DeepSeek, OpenAI, and Gemini
- Prompt textarea
- Optional model, temperature, and max token inputs
- Submit button
- Provider, model, content, usage, and error viewer

DeepSeek performs a real provider request when `DEEPSEEK_API_KEY` is configured. OpenAI performs a real provider request when `OPENAI_API_KEY` is configured. Gemini returns a mocked response.

## Phase 1.5 Scope

Included:

- Repository layer for campaigns, products, affiliate links, content counts, and AI jobs
- Service layer for campaigns, products, affiliate links, dashboard counts, and AI text generation
- Zod validation for create/update operations
- Typed application errors with safe user-facing messages
- Environment validation for Supabase and DeepSeek
- Logger utility used by services, repositories, and AI provider code
- Real DeepSeek API integration
- Real OpenAI text generation integration
- AI provider test route

Intentionally not included yet:

- Product Hunter
- Product scraping
- Affiliate platform integrations
- Agents
- Automation workflows
- Content generation features
- Click tracking and revenue attribution
- Billing or team accounts

## Quality Checks

```bash
npm run lint
npm run format:check
npm run build
```

Latest Phase 1.5 verification:

- `npm run lint` passed.
- `npm run build` passed.

## Next Phase Recommendation

Stop after Phase 1.5 until reviewer approval. The recommended next phase is Phase 2 - Product Hunter only after reviewer validation of Supabase configuration, auth behavior, CRUD flows, and the DeepSeek provider test.
# affiliate-manager-26
