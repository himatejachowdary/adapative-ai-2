"use client";

import { useFormState } from "react-dom";
import { personalizedLearningPath } from "@/ai/flows/personalized-learning-path";
import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Hourglass, Loader2, ServerCrash } from "lucide-react";
import type { PersonalizedLearningPathOutput } from "@/ai/flows/personalized-learning-path";

type State = {
  result: PersonalizedLearningPathOutput | null;
  error: string | null;
  loading: boolean;
};

const initialState: State = {
  result: null,
  error: null,
  loading: false,
};

async function generatePathAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const result = await personalizedLearningPath({
      proficiencyLevel: formData.get("proficiencyLevel") as "beginner" | "intermediate" | "advanced",
      goals: formData.get("goals") as string,
      learningStyle: formData.get("learningStyle") as "visual" | "auditory" | "kinesthetic" | "reading/writing",
    });
    return { result, error: null, loading: false };
  } catch (e: any) {
    return { result: null, error: e.message, loading: false };
  }
}

export default function PathPage() {
  const [state, formAction] = useFormState(generatePathAction, initialState);

  return (
    <AppLayout>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-glow-primary">Personalized Learning Path</h1>
            <p className="text-muted-foreground">Tell us about your goals, and we'll generate a custom learning path for you.</p>
          </div>
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle>Define Your Path</CardTitle>
            </CardHeader>
            <form action={formAction}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
                  <Select name="proficiencyLevel" defaultValue="beginner" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals">Learning Goals</Label>
                  <Input name="goals" placeholder="e.g., 'Build a full-stack web app with Next.js'" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learningStyle">Preferred Learning Style</Label>
                  <Select name="learningStyle" defaultValue="visual" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditory</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                      <SelectItem value="reading/writing">Reading/Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full button-glow-primary">
                   Generate Path
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Custom Path</h2>
            <Card className="min-h-[400px] flex items-center justify-center glassmorphic">
            {state.loading && (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Generating your path...</p>
              </div>
            )}
            {state.error && (
               <div className="flex flex-col items-center gap-4 text-destructive p-4">
                <ServerCrash className="h-12 w-12" />
                <p className="font-bold">An error occurred</p>
                <p className="text-sm text-center">{state.error}</p>
              </div>
            )}
            {state.result && (
              <div className="w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-glow-accent">Generated Path</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hourglass className="h-4 w-4" />
                        <span>{state.result.estimatedCompletionTime}</span>
                    </div>
                </div>
                <ul className="space-y-3">
                  {state.result.learningPath.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                {state.result.additionalNotes && (
                    <div className="mt-6 border-t pt-4">
                        <h4 className="font-semibold mb-2">Additional Notes</h4>
                        <p className="text-muted-foreground text-sm">{state.result.additionalNotes}</p>
                    </div>
                )}
              </div>
            )}
            {!state.loading && !state.error && !state.result && (
                 <div className="text-center text-muted-foreground">
                    <p>Your generated learning path will appear here.</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
