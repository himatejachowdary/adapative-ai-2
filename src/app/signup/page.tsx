'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState, useEffect } from "react";
import { initiateEmailSignUp, useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoogleIcon from "@/components/icons/google";

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
  
  // A placeholder for Google Sign-In logic
  const handleGoogleSignIn = () => {
    setLoading(true);
    // TODO: Implement Google Sign-In logic with Firebase
    console.log("Attempting Google Sign-In...");
    toast({
      title: "Feature not implemented",
      description: "Google Sign-In is not yet configured.",
    })
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#E5E5E5]">
            Create your Account
          </h1>
          <p className="mt-2 text-[#A0A0A0]">Start your personalized learning journey.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <Input
            id="name"
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-[18px] border-[#2B2B2B] bg-[#101010] px-4 text-[#E5E5E5] placeholder:text-[#A0A0A0] focus:border-[#A0A0A0] focus:ring-0"
            disabled={loading}
          />
          <Input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-[18px] border-[#2B2B2B] bg-[#101010] px-4 text-[#E5E5E5] placeholder:text-[#A0A0A0] focus:border-[#A0A0A0] focus:ring-0"
            disabled={loading}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-[18px] border-[#2B2B2B] bg-[#101010] px-4 text-[#E5E5E5] placeholder:text-[#A0A0A0] focus:border-[#A0A0A0] focus:ring-0"
            disabled={loading}
          />
          <Button
            type="submit"
            className="h-14 w-full rounded-[20px] border-[#3A3A3A] bg-gradient-to-b from-[#262626] to-[#1A1A1A] text-lg font-bold text-white hover:from-[#2A2A2A] hover:to-[#1F1F1F]"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <div className="flex-grow border-t border-[#2B2B2B]"></div>
          <span className="text-sm text-[#A0A0A0]">OR</span>
          <div className="flex-grow border-t border-[#2B2B2B]"></div>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-[18px] border-[#3A3A3A] bg-[#262626] text-[#E5E5E5] hover:bg-[#333333] hover:text-white"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon className="mr-3 h-5 w-5" />
          Sign Up with Google
        </Button>

        <div className="text-center text-sm text-[#A0A0A0]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#E5E5E5] underline-offset-2 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
