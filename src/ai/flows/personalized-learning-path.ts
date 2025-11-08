'use server';

/**
 * @fileOverview Personalized learning path generation flow.
 *
 * This file defines a Genkit flow that generates a personalized learning path
 * for a user based on their proficiency level, goals, and preferred learning
 * style.
 *
 * @exports {personalizedLearningPath} - The main function to trigger the flow.
 * @exports {PersonalizedLearningPathInput} - The input type for the flow.
 * @exports {PersonalizedLearningPathOutput} - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningPathInputSchema = z.object({
  proficiencyLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The user proficiency level.'),
  goals: z.string().describe('The user learning goals.'),
  learningStyle: z
    .enum(['visual', 'auditory', 'kinesthetic', 'reading/writing'])
    .describe('The user preferred learning style.'),
});

export type PersonalizedLearningPathInput = z.infer<
  typeof PersonalizedLearningPathInputSchema
>;

const PersonalizedLearningPathOutputSchema = z.object({
  learningPath: z
    .array(z.string())
    .describe('A list of learning resources in the order they should be consumed.'),
  estimatedCompletionTime: z
    .string()
    .describe('Estimated time to complete the learning path.'),
  additionalNotes: z.string().optional().describe('Any additional notes.'),
});

export type PersonalizedLearningPathOutput = z.infer<
  typeof PersonalizedLearningPathOutputSchema
>;

const personalizedLearningPathPrompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: {schema: PersonalizedLearningPathInputSchema},
  output: {schema: PersonalizedLearningPathOutputSchema},
  prompt: `You are an expert learning path generator. You will generate a personalized learning path for a user based on their proficiency level, goals, and preferred learning style.

Proficiency Level: {{{proficiencyLevel}}}
Goals: {{{goals}}}
Learning Style: {{{learningStyle}}}

Generate a learning path that is tailored to the user's needs and preferences. The learning path should be a list of learning resources in the order they should be consumed. The learning path should also include an estimated completion time.
`,
});

const personalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'personalizedLearningPathFlow',
    inputSchema: PersonalizedLearningPathInputSchema,
    outputSchema: PersonalizedLearningPathOutputSchema,
  },
  async input => {
    const {output} = await personalizedLearningPathPrompt(input);
    return output!;
  }
);

export async function personalizedLearningPath(
  input: PersonalizedLearningPathInput
): Promise<PersonalizedLearningPathOutput> {
  return personalizedLearningPathFlow(input);
}
