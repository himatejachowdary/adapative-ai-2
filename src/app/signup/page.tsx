import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedBackground from "@/components/auth/animated-background";
import Logo from "@/components/auth/logo";

export default function SignupPage() {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-sm glassmorphic">
          <CardHeader className="items-center text-center">
             <Link href="/" className="mb-4">
              <Logo />
            </Link>
            <CardTitle className="text-3xl font-bold text-glow-accent">Sign Up</CardTitle>
            <CardDescription>Create an account to start your personalized learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full button-glow-accent">
                Create Account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-glow-primary">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
