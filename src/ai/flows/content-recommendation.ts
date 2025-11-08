'use server';

/**
 * @fileOverview AI-powered content recommendation flow based on user learning path and progress.
 *
 * - contentRecommendation - A function that handles the content recommendation process.
 * - ContentRecommendationInput - The input type for the contentRecommendation function.
 * - ContentRecommendationOutput - The return type for the contentRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRecommendationInputSchema = z.object({
  learningPath: z
    .string()
    .describe('The learning path of the user (e.g. beginner, intermediate, advanced)'),
  progress: z.number().describe('The progress of the user in the learning path (0-100)'),
  preferredLearningStyle: z
    .string()
    .describe('The preferred learning style of the user (e.g. visual, auditory, kinesthetic)'),
});
export type ContentRecommendationInput = z.infer<typeof ContentRecommendationInputSchema>;

const ContentRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('The title of the learning resource'),
      type: z.string().describe('The type of learning resource (e.g. article, video, exercise)'),
      url: z.string().url().describe('The URL of the learning resource'),
      description: z.string().describe('A short description of the learning resource'),
    })
  ).describe('A list of recommended learning resources'),
});
export type ContentRecommendationOutput = z.infer<typeof ContentRecommendationOutputSchema>;

export async function contentRecommendation(input: ContentRecommendationInput): Promise<ContentRecommendationOutput> {
  return contentRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRecommendationPrompt',
  input: {schema: ContentRecommendationInputSchema},
  output: {schema: ContentRecommendationOutputSchema},
  prompt: `You are an AI learning assistant that recommends learning resources to users based on their learning path, progress, and preferred learning style.

  Learning Path: {{{learningPath}}}
  Progress: {{{progress}}}%
  Preferred Learning Style: {{{preferredLearningStyle}}}

  Recommend relevant learning resources (articles, videos, exercises) that match the user's learning path, progress, and preferred learning style. Provide the title, type, URL, and a short description for each resource.

  Ensure that the URLs are valid and the resources are appropriate for the user's current level of understanding.

  Return the output in JSON format.
  `,
});

const contentRecommendationFlow = ai.defineFlow(
  {
    name: 'contentRecommendationFlow',
    inputSchema: ContentRecommendationInputSchema,
    outputSchema: ContentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
