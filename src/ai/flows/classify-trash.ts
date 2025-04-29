// This file is machine-generated - do not edit!

'use server';
/**
 * @fileOverview Classifies trash found in an image.
 *
 * - classifyTrash - A function that classifies trash found in an image.
 * - ClassifyTrashInput - The input type for the classifyTrash function.
 * - ClassifyTrashOutput - The return type for the classifyTrash function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ClassifyTrashInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of trash, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyTrashInput = z.infer<typeof ClassifyTrashInputSchema>;

const ClassifyTrashOutputSchema = z.object({
  trashType: z.string().describe('The type of trash found in the image.'),
  confidence: z
    .number()
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
    schema: z.object({
      trashType: z.string().describe('The type of trash found in the image.'),
      confidence: z
        .number()
        .describe('The confidence level of the trash classification (0-1).'),
    }),
  },
  prompt: `You are an expert in identifying trash on beaches.

  Analyze the image and identify the type of trash in the image. Also, provide a confidence level (0-1) for your classification.

  Photo: {{media url=photoDataUri}}`,
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
  const {output} = await prompt(input);
  return output!;
});
