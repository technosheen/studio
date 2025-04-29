// Summarize cleanup flow.
'use server';

/**
 * @fileOverview A cleanup summarization AI agent.
 *
 * - summarizeCleanup - A function that handles the cleanup summarization process.
 * - SummarizeCleanupInput - The input type for the summarizeCleanup function.
 * - SummarizeCleanupOutput - The return type for the summarizeCleanup function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeCleanupInputSchema = z.object({
  imageUrls: z
    .array(z.string())
    .describe("An array of image URLs of the trash collected during the cleanup."),
});
export type SummarizeCleanupInput = z.infer<typeof SummarizeCleanupInputSchema>;

const SummarizeCleanupOutputSchema = z.object({
  summary: z.string().describe('A summary of the types and amounts of trash collected.'),
});
export type SummarizeCleanupOutput = z.infer<typeof SummarizeCleanupOutputSchema>;

export async function summarizeCleanup(input: SummarizeCleanupInput): Promise<SummarizeCleanupOutput> {
  return summarizeCleanupFlow(input);
}

const summarizeCleanupPrompt = ai.definePrompt({
  name: 'summarizeCleanupPrompt',
  input: {
    schema: z.object({
      imageUrls: z
        .array(z.string())
        .describe("An array of image URLs of the trash collected during the cleanup."),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the types and amounts of trash collected.'),
    }),
  },
  prompt: `You are an expert in analyzing trash data from beach cleanups.

You will be provided with a list of image URLs of trash collected during a cleanup event.
Your task is to generate a concise summary of the types and amounts of trash collected, which will be used for reporting and analysis.

Image URLs: {{{imageUrls}}}`,
});

const summarizeCleanupFlow = ai.defineFlow<
  typeof SummarizeCleanupInputSchema,
  typeof SummarizeCleanupOutputSchema
>(
  {
    name: 'summarizeCleanupFlow',
    inputSchema: SummarizeCleanupInputSchema,
    outputSchema: SummarizeCleanupOutputSchema,
  },
  async input => {
    const {output} = await summarizeCleanupPrompt(input);
    return output!;
  }
);
