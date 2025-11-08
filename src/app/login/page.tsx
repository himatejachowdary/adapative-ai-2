
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleIcon from '@/components/icons/google';
import { FormEvent, useEffect, useState } from 'react';
import {
  initiateEmailSignIn,
  initiateGoogleSignIn,
  useAuth,
  useFirestore,
  useUser,
} from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('am_session_active') === 'true') {
      router.push('/dashboard');
      return;
    }
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'Firebase not initialized' });
      setLoading(false);
      return;
    }
    try {
      const cred = await initiateEmailSignIn(auth, email, password);
      const user = cred.user;
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });

      localStorage.setItem('am_session_active', 'true');
      localStorage.setItem('am_user_uid', user.uid);
      if(user.email) localStorage.setItem('am_user_email', user.email);
      if(user.displayName) localStorage.setItem('am_user_name', user.displayName);
      
      toast({ title: 'Logged In Successfully' });
      // onAuthStateChanged will handle the redirect
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'Firebase not initialized' });
      setGoogleLoading(false);
      return;
    }
    try {
      const userCredential = await initiateGoogleSignIn(auth);
      const user = userCredential.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          provider: 'google',
        });
        toast({ title: 'Account Created via Google' });
      } else {
        await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        toast({ title: 'Logged In Successfully' });
      }

      localStorage.setItem('am_session_active', 'true');
      localStorage.setItem('am_user_uid', user.uid);
      if(user.email) localStorage.setItem('am_user_email', user.email);
      if(user.displayName) localStorage.setItem('am_user_name', user.displayName);
      
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
          <h1 className="text-3xl font-bold text-[#E5E5E5]">
            Login to AdaptiveMind AI
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
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
            className="h-12 w-full rounded-[20px] bg-gradient-to-b from-[#262626] to-[#1A1A1A] text-lg font-semibold text-white border border-[#3A3A3A] hover:from-[#2A2A2A] hover:to-[#1F1F1F]"
            disabled={loading || googleLoading}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Login'}
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#3C4043]" />
          ) : (
            <GoogleIcon className="mr-3 h-6 w-6" />
          )}
          Continue with Google
        </Button>

        <div className="text-center text-sm text-[#A0A0A0]">
          Don’t have an account?{' '}
          <Link
            href="/signup"
            className="font-bold text-[#E5E5E5] underline-offset-2 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
