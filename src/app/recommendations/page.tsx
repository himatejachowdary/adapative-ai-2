
"use client";

import { useFormState } from "react-dom";
import { contentRecommendation } from "@/ai/flows/content-recommendation";
import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import type { ContentRecommendationOutput } from "@/ai/flows/content-recommendation";
import { Loader2, ServerCrash, BookOpen, Video, Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type State = {
  result: ContentRecommendationOutput | null;
  error: string | null;
  loading: boolean;
};

const initialState: State = {
  result: null,
  error: null,
  loading: false,
};

async function getRecommendationsAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const result = await contentRecommendation({
      learningPath: formData.get("learningPath") as string,
      progress: parseInt(formData.get("progress") as string, 10),
      preferredLearningStyle: formData.get("preferredLearningStyle") as string,
    });
    return { result, error: null, loading: false };
  } catch (e: any) {
    return { result: null, error: e.message, loading: false };
  }
}

const typeToIcon = {
  article: BookOpen,
  video: Video,
  exercise: Code,
};

export default function RecommendationsPage() {
  const [state, formAction] = useFormState(getRecommendationsAction, initialState);
  const [progress, setProgress] = useState(50);

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-glow-primary">Content Recommendations</h1>
          <p className="text-muted-foreground">Find the best resources to continue your learning journey.</p>
        </div>
        <Card className="glassmorphic">
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Find Your Next Resource</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="learningPath">Learning Path</Label>
                <Select name="learningPath" defaultValue="beginner" required>
                  <SelectTrigger><SelectValue placeholder="Select path" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLearningStyle">Learning Style</Label>
                <Select name="preferredLearningStyle" defaultValue="visual" required>
                  <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="auditory">Auditory</SelectItem>
                    <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Progress ({progress}%)</Label>
                <Slider name="progress" value={[progress]} onValueChange={(v) => setProgress(v[0])} max={100} step={1} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="button-glow-primary">Get Recommendations</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8">
            {state.loading && (
              <div className="flex flex-col items-center gap-4 text-muted-foreground mt-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Finding recommendations...</p>
              </div>
            )}
            {state.error && (
               <div className="flex flex-col items-center gap-4 text-destructive p-4 mt-12">
                <ServerCrash className="h-12 w-12" />
                <p className="font-bold">An error occurred</p>
                <p className="text-sm text-center">{state.error}</p>
              </div>
            )}
            {state.result && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {state.result.recommendations.map((rec, index) => {
                        const Icon = typeToIcon[rec.type.toLowerCase() as keyof typeof typeToIcon] || BookOpen;
                        return (
                            <Card key={index} className="flex flex-col glassmorphic hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardDescription className="capitalize text-accent">{rec.type}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <Image data-ai-hint="technology abstract" src={`https://picsum.photos/seed/${index+1}/600/400`} alt={rec.title} width={600} height={400} className="rounded-md mb-4" />
                                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href={rec.url} target="_blank" rel="noopener noreferrer">
                                            Go to resource
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
             {!state.loading && !state.error && !state.result && (
                 <div className="text-center text-muted-foreground mt-12">
                    <p>Your recommended content will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}
