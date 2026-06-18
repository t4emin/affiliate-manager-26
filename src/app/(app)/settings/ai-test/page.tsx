import { AiTestForm } from "@/components/forms/ai-test-form";
import { PageHeader } from "@/components/layout/page-header";
import { getCurrentUserOrRedirect } from "@/lib/auth";

export default async function AiTestPage() {
  await getCurrentUserOrRedirect();

  return (
    <>
      <PageHeader
        title="AI provider test"
        description="Verify DeepSeek, OpenAI, and Gemini before enabling product workflows."
      />
      <AiTestForm />
    </>
  );
}
