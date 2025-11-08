import Link from "next/link";
import { AppLayout } from "@/components/app/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, GitFork, Lightbulb } from "lucide-react";

const featureCards = [
  {
    title: "Generate Your Path",
    description: "Let our AI create a personalized learning path tailored to your goals.",
    href: "/path",
    icon: GitFork,
    cta: "Start Generating"
  },
  {
    title: "Get Recommendations",
    description: "Discover new articles, videos, and exercises based on your progress.",
    href: "/recommendations",
    icon: Lightbulb,
    cta: "Find Content"
  },
  {
    title: "Track Your Progress",
    description: "Visualize your learning journey and identify areas for improvement.",
    href: "/progress",
    icon: BarChart3,
    cta: "View Progress"
  }
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-glow-primary">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a snapshot of your learning journey. Ready to dive in?
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
             <Card key={feature.title} className="flex flex-col glassmorphic hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <CardContent>
                 <Button asChild variant="outline" className="w-full">
                  <Link href={feature.href}>
                    {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
