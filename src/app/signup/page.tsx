'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedBackground from "@/components/auth/animated-background";
import Logo from "@/components/auth/logo";
import { FormEvent, useState, useEffect } from "react";
import { initiateEmailSignUp, useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await initiateEmailSignUp(auth, email, password);
      if (userCredential && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      // The onAuthStateChanged listener will handle redirect
    } catch (error: any) {
      console.error("Sign up failed:", error);
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "An unexpected error occurred.",
      });
      setLoading(false);
    }
  };

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
            <form className="space-y-4" onSubmit={handleSignUp}>
               <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full button-glow-accent" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
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
