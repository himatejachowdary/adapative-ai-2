
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleIcon from '@/components/icons/google';
import { FormEvent, useEffect, useState } from 'react';
import {
  initiateEmailSignUp,
  initiateGoogleSignIn,
  useAuth,
  useUser,
} from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import Logo from '@/components/auth/logo';

export default function SignupPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        // Optionally update phone number if your app logic requires it.
        // Firebase Auth doesn't directly store phone number this way without verification.
      }
      // onAuthStateChanged will handle the redirect
    } catch (error: any) {
      console.error('Sign up failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sign up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      // onAuthStateChanged will redirect
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setGoogleLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-4">
      <Link href="/" className="absolute top-8 left-8 text-[#E5E5E5] hover:text-white transition-colors">
          <ArrowLeft size={24} />
      </Link>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
            <Link href="/" className='flex justify-center items-center gap-3 mb-6'>
                <Logo className="h-8 w-8 text-white" />
            </Link>
          <h1 className="text-3xl font-bold text-[#E5E5E5]">
            Create Your AdaptiveMind AI Account
          </h1>
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
            disabled={loading || googleLoading}
          />
          <Input
            id="phone"
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 w-full rounded-[18px] border-[#2B2B2B] bg-[#101010] px-4 text-[#E5E5E5] placeholder:text-[#A0A0A0] focus:border-[#A0A0A0] focus:ring-0"
            disabled={loading || googleLoading}
          />
          <Input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-[18px] border-[#2B2B2B] bg-[#101010] px-4 text-[#E5E5E5] placeholder:text-[#A0A0A0] focus:border-[#A0A0A0] focus:ring-0"
            disabled={loading || googleLoading}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 w-full rounded-[18px] border-[#2B2B2B] bg-[#101010] px-4 text-[#E5E5E5] placeholder:text-[#A0A0A0] focus:border-[#A0A0A0] focus:ring-0"
            disabled={loading || googleLoading}
          />
          <Button
            type="submit"
            className="h-12 w-full rounded-[18px] bg-[#1A1A1A] text-lg font-semibold text-white border border-[#2B2B2B] hover:bg-[#262626]"
            disabled={loading || googleLoading}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign Up'}
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <div className="flex-grow border-t border-[#2B2B2B]"></div>
          <span className="text-sm text-[#A0A0A0]">OR</span>
          <div className="flex-grow border-t border-[#2B2B2B]"></div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full h-12 rounded-[18px] bg-white text-[#3C4043] border border-[#DADCE0] font-medium text-base hover:bg-gray-100"
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-3 h-6 w-6" />
          )}
          Continue with Google
        </Button>

        <div className="text-center text-sm text-[#A0A0A0]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#E5E5E5] underline-offset-2 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
