# Affiliate AI OS - Project Update

## Current Phase

Phase 1.5 - AI Provider Selection Improvement

## Completed

- Preserved the existing Phase 1 auth, protected routes, dashboard, campaign CRUD, product CRUD, and affiliate link CRUD behavior.
- Added `zod` for validation.
- Added repository files for campaigns, products, affiliate links, content counts, and AI jobs.
- Added service files for campaigns, products, affiliate links, dashboard counts, and AI text generation.
- Refactored server actions to call services instead of accessing Supabase directly.
- Refactored app data reads to use services and repositories.
- Added typed application errors with safe user-facing messages.
- Added centralized logging.
- Added environment validation for Supabase and DeepSeek settings.
- Implemented real DeepSeek text generation with API key loading, configurable model, timeout, retry, usage passthrough, and typed responses.
- Implemented real OpenAI text generation with API key loading, configurable model, timeout, retry, usage passthrough, and typed responses.
- Added shared AI provider types in `src/lib/ai/types.ts`.
- Updated `ai.service.ts` as the single provider-selection entry point for text generation.
- Updated `/settings/ai-test` to show provider, model, content, usage, and errors.
- Updated README architecture, AI layer, and provider strategy documentation.

## Not Completed

- Product Hunter was not started.
- Product scraping was not added.
- Affiliate platform integrations were not added.
- Agents were not added.
- Automation workflows were not added.
- Content generation workflows were not added.
- Gemini remains mocked by design for this provider-selection improvement.
- Runtime Supabase CRUD and real DeepSeek calls were not verified with live credentials in this environment.
- Runtime real OpenAI calls were not verified because no live `OPENAI_API_KEY` is available in this environment.

## Architecture Improvements

Target flow is now implemented for writes:

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

- Repositories contain Supabase database access only.
- Services handle validation orchestration, repository orchestration, logging, and error conversion.
- Server Actions handle user context, redirects, cache invalidation, and service calls.
- Server-rendered app pages now use services for reads instead of inline Supabase table access.

## Validation Improvements

- Campaign create/update validates required `name` and max length.
- Product create/update validates required `name`, URL fields when provided, numeric price, non-negative price, and AI score bounds.
- Affiliate link create/update validates required `affiliate_url` and URL format.
- Form validation errors are returned as safe user-facing redirect messages.

## AI Infrastructure Status

- `src/lib/services/ai.service.ts` exposes `generateText({ provider, prompt, model, temperature, maxTokens })`.
- Supported providers are `deepseek`, `openai`, and `gemini`.
- UI and future features should call the service, not provider modules.
- `/settings/ai-test` can test all supported providers.

Provider routing:

- `provider=deepseek` calls `generateTextWithDeepSeek()`.
- `provider=openai` calls `generateTextWithOpenAI()`.
- `provider=gemini` returns a mocked Gemini text response.

## DeepSeek Integration Status

- `src/lib/ai/deepseek.ts` now performs real requests to `https://api.deepseek.com/chat/completions`.
- Reads `DEEPSEEK_API_KEY`.
- Uses `DEEPSEEK_MODEL` when configured, otherwise defaults to `deepseek-chat`.
- Supports timeout and retry options.
- Returns:

```ts
{
  success: boolean;
  content: string;
  usage?: object;
  error?: string;
}
```

## OpenAI Provider Status

- `src/lib/ai/openai.ts` now includes `generateTextWithOpenAI(input)`.
- Reads `OPENAI_API_KEY` only when OpenAI is selected.
- Uses `OPENAI_MODEL` when configured, otherwise defaults to `gpt-4o-mini`.
- Supports timeout and retry options.
- Returns the shared text generation result shape with optional model and usage metadata.
- Existing mocked OpenAI review/image helper functions remain in place for future phases.

## AI Playground Status

- `/settings/ai-test` includes DeepSeek, OpenAI, and Gemini in the provider dropdown.
- The form accepts prompt, optional model, optional temperature, and optional max token settings.
- The response view shows provider used, model used, content, usage JSON when available, and safe errors when a request fails.

## Known Issues

- `.env.local` is not present in the repository and must be created from `.env.example`.
- Supabase URL and anon key are required for protected app flows.
- `DEEPSEEK_API_KEY` is required only when selecting DeepSeek for a real request.
- `OPENAI_API_KEY` is required only when selecting OpenAI for a real request.
- Gemini remains mocked until its real provider implementation is approved.
- `npm install zod` reported the existing Node engine warning for `eslint-visitor-keys` because this local environment runs Node `v20.11.0`; the package requests `^20.19.0 || ^22.13.0 || >=24`.
- `npm audit` still reports 2 moderate vulnerabilities through existing dependencies; breaking force fixes were not applied.

## Technical Debt

- Repositories use focused query functions, but there is no shared repository base helper yet.
- Auth actions still directly use Supabase Auth because Phase 1.5 repository requirements targeted database access, not auth client operations.
- Live integration tests are still needed for Supabase RLS behavior, DeepSeek API behavior, and OpenAI API behavior.
- Gemini needs a real provider module in a later approved phase.

## Testing Results

- `npm run lint` passed.
- `npm run build` passed.
- Prettier formatted the TypeScript and TSX files touched by this update. `.env.example` was not passed through Prettier because no parser is inferred for env files.
- `npm install zod` completed with a Node engine warning and existing moderate audit advisories.

## Reviewer Notes

- Phase 1.5 stopped at architecture hardening.
- Existing CRUD screens were preserved rather than rebuilt.
- No Product Hunter, scraping, affiliate API, agent, automation, or content generation work was started.
- Database access is centralized under `src/lib/repositories`.
- The AI playground exists only to verify providers before future feature work.
- OpenAI text generation is ready for live testing once `OPENAI_API_KEY` is configured.

## Recommended Next Phase

Reviewer should validate auth, CRUD flows, RLS behavior, and `/settings/ai-test` with real Supabase, DeepSeek, and OpenAI credentials.

After approval, the project is ready to proceed to Phase 2 - Product Hunter. Do not begin Phase 2 until this AI provider-selection improvement is reviewed.
