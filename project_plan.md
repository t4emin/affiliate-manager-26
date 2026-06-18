# Affiliate AI OS - Project Plan

## Project Goal

Affiliate AI OS is a system designed to help one person operate affiliate marketing work like a small team.

Main workflow:

```text
Find products
↓
Analyze products
↓
Create content
↓
Create images
↓
Create videos
↓
Publish content
↓
Track results
↓
Improve campaigns
```

## Core Architecture Rules

Database access must not be called directly from UI.

Required database flow:

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

AI providers must not be called directly from UI.

Required AI flow:

```text
UI
↓
Server Actions
↓
Services
↓
AI Service
↓
Provider Layer
↓
External AI
```

## AI Provider Strategy

### DeepSeek

Use for:

- Product analysis
- SEO drafts
- Content drafts
- Captions
- Keyword research
- Batch generation
- High-volume low-cost work

Current status:

- Real text generation implemented.
- Uses `DEEPSEEK_API_KEY` only when DeepSeek is selected.
- Supports `DEEPSEEK_MODEL`, defaulting to `deepseek-chat`.
- Supports timeout, retry, typed response, and usage passthrough.

### OpenAI

Use for:

- Content review
- Content rewrite
- Content polish
- Final output
- Premium rewriting
- Image generation later

Current status:

- Real text generation implemented.
- Uses `OPENAI_API_KEY` only when OpenAI is selected.
- Supports `OPENAI_MODEL`, defaulting to `gpt-4o-mini`.
- Supports timeout, retry, typed response, and usage passthrough.
- Image generation is not implemented yet.

### Gemini

Use later for:

- Long context
- Competitor analysis
- Image analysis
- Video analysis
- Large document analysis

Current status:

- Text generation is mocked.
- Real Gemini provider integration is not implemented yet.

## Current Completed Scope

### Phase 1 - Foundation

Status: Completed.

Completed:

- Authentication
- Protected app routes
- Dashboard
- Campaign CRUD
- Product CRUD
- Affiliate Link CRUD
- Supabase integration
- Supabase RLS policies

### Phase 1.5 - Hardening

Status: Completed.

Completed:

- Repository layer
- Service layer
- Validation layer with Zod
- Typed error handling
- Safe user-facing error messages
- Logger
- Environment validation
- Real DeepSeek text generation
- AI Playground at `/settings/ai-test`

### AI Provider Selection Improvement

Status: Completed.

Completed:

- Shared AI types in `src/lib/ai/types.ts`
- Real OpenAI text generation in `src/lib/ai/openai.ts`
- DeepSeek and OpenAI provider routing through `src/lib/services/ai.service.ts`
- `generateText({ provider, prompt, model, temperature, maxTokens })`
- Supported providers: `deepseek`, `openai`, `gemini`
- Gemini mocked response for now
- AI Playground shows provider, model, content, usage, and error
- `.env.example` includes:
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_MODEL=deepseek-chat`
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL=gpt-4o-mini`
  - `GEMINI_API_KEY`

## Not Started Yet

Do not assume these exist.

- Phase 2 Product Hunter
- Product scraping
- Browser automation
- Agent system
- Auto publish
- Affiliate platform API integrations
- Content Studio
- Creative Studio
- Research Intelligence
- Click tracking
- Revenue attribution
- Billing
- Team accounts

## Phase 2 - Product Hunter

Status: Next phase, not started.

Goal:

Allow the user to paste a product URL and have AI analyze the product.

Target workflow:

```text
Paste Product URL
↓
Extract Product Info
↓
AI Analysis
↓
Save Result
↓
Show Report
```

Required outputs:

- Opportunity Score
- Competition Score
- Target Audience
- Pain Points
- USP
- Content Angles

Out of scope for Phase 2:

- Browser automation
- Agent system
- Auto publish
- Affiliate platform API
- Advanced scraping

Definition of Done:

- User can paste a product URL.
- System can extract or accept basic product info.
- AI can analyze the product.
- System can save the analysis result.
- UI can show the analysis report.

## Later Roadmap

### Phase 3 - Content Studio

Goal:

Create content from saved products.

Supported content types:

- SEO Blog
- Facebook Post
- TikTok Script
- YouTube Script
- X Thread
- Email Content

Workflow:

```text
Product
↓
DeepSeek Draft
↓
OpenAI Review
↓
Final Content
```

### Phase 4 - Creative Studio

Goal:

Create image assets.

Supported assets:

- Banner
- Thumbnail
- Pinterest Pin
- Social Creative

Primary AI provider:

- OpenAI

### Phase 5 - Research Intelligence

Goal:

Analyze markets and competitors.

Primary AI provider:

- Gemini

Expected outputs:

- Competitor Analysis
- Keyword Opportunity
- FAQ Analysis
- Market Insight

## Current Verification Status

Latest checks passed:

- `npm run lint`
- `npm run build`

Not verified in this environment:

- Runtime Supabase CRUD with real Supabase credentials
- Real DeepSeek API request with live `DEEPSEEK_API_KEY`
- Real OpenAI API request with live `OPENAI_API_KEY`

Known environment notes:

- `.env.local` is not committed and must be created locally.
- Supabase URL and anon key are required for protected app flows.
- AI keys are optional at app startup but required when selecting that provider for real requests.
- Gemini remains mocked.

## Readiness Review Checklist Before Phase 2

Before starting Product Hunter, review:

- Auth works with real Supabase project.
- Dashboard and existing CRUD flows work with real Supabase project.
- RLS policies correctly isolate user-owned records.
- `/settings/ai-test` works for DeepSeek with a real key.
- `/settings/ai-test` works for OpenAI with a real key.
- Missing AI keys return safe provider-specific errors.
- `npm run lint` passes.
- `npm run build` passes.
- No direct database access is added outside repositories.
- No direct AI provider access is added outside provider layer and AI service.

## Current Recommendation

The codebase appears structurally ready for review before Phase 2.

Do not begin Phase 2 Product Hunter until reviewer approval confirms:

- Existing Phase 1 flows are stable.
- Phase 1.5 architecture is acceptable.
- DeepSeek and OpenAI provider tests are acceptable.
- Product Hunter scope is explicitly approved.
