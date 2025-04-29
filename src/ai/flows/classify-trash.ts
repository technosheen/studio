'use server';
/**
 * @fileOverview Classifies trash found in an image and associates it with a location.
 *
 * - classifyTrash - A function that classifies trash found in an image.
 * - ClassifyTrashInput - The input type for the classifyTrash function.
 * - ClassifyTrashOutput - The return type for the classifyTrash function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Input now includes optional location, but it's practically required by the UI flow.
const ClassifyTrashInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of trash, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyTrashInput = z.infer<typeof ClassifyTrashInputSchema>;

// Output schema remains focused on classification result. Location is handled separately in the application logic.
const ClassifyTrashOutputSchema = z.object({
  trashType: z.string().describe('The type of trash found in the image (e.g., Plastic Bottle, Aluminum Can, Paper Scrap).'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence level of the trash classification (0-1).'),
});
export type ClassifyTrashOutput = z.infer<typeof ClassifyTrashOutputSchema>;

export async function classifyTrash(input: ClassifyTrashInput): Promise<ClassifyTrashOutput> {
  return classifyTrashFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyTrashPrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of trash, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    // Explicitly define the output schema for the AI model
    schema: ClassifyTrashOutputSchema,
  },
  prompt: `You are an expert in identifying and classifying common types of trash found on beaches.

  Analyze the provided image of trash found on a beach. Identify the primary type of trash visible in the image.
  Provide the classification as a specific noun or short phrase (e.g., "Plastic Bottle", "Aluminum Can", "Fishing Net", "Paper Scrap", "Glass Fragment", "Cigarette Butt", "Food Wrapper").
  Also, provide a confidence score between 0.0 and 1.0 indicating how certain you are about the classification.

  Image of trash: {{media url=photoDataUri}}`,
});

const classifyTrashFlow = ai.defineFlow<
  typeof ClassifyTrashInputSchema,
  typeof ClassifyTrashOutputSchema
>({
  name: 'classifyTrashFlow',
  inputSchema: ClassifyTrashInputSchema,
  outputSchema: ClassifyTrashOutputSchema,
},
async input => {
  // Call the prompt with only the photo data URI
  const { output } = await prompt({ photoDataUri: input.photoDataUri });

  if (!output) {
    throw new Error('AI failed to produce an output for trash classification.');
  }

  // Ensure the output conforms to the schema, especially clamping confidence.
  const confidence = Math.min(1, Math.max(0, output.confidence));

  return {
    trashType: output.trashType,
    confidence: confidence,
  };
});
