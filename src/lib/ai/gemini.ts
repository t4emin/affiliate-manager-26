type LongContextInput = {
  content: string;
  question?: string;
};

type MediaAnalysisInput = {
  mediaUrl: string;
  mediaType: "image" | "video";
  prompt?: string;
};

type ProviderResult<T> = {
  provider: "gemini";
  mocked: boolean;
  data: T;
};

export async function analyzeLongContextWithGemini(
  input: LongContextInput,
): Promise<ProviderResult<{ summary: string; answer: string | null }>> {
  return {
    provider: "gemini",
    mocked: true,
    data: {
      summary: `Mock Gemini long-context summary for ${input.content.length} characters.`,
      answer: input.question ? "Mock Gemini answer." : null,
    },
  };
}

export async function analyzeMediaWithGemini(
  input: MediaAnalysisInput,
): Promise<ProviderResult<{ observations: string[]; mediaUrl: string }>> {
  return {
    provider: "gemini",
    mocked: true,
    data: {
      observations: [`Mock Gemini ${input.mediaType} analysis.`],
      mediaUrl: input.mediaUrl,
    },
  };
}
