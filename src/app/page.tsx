
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/icons/google';
import { useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { initiateGoogleSignIn, useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/auth/logo';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function OpeningPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for active session in localStorage for immediate redirect
    if (localStorage.getItem('am_session_active') === 'true') {
      router.push('/dashboard');
      return;
    }
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Firebase not initialized',
        description: 'Please try again later.',
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await initiateGoogleSignIn(auth);
      const user = userCredential.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // First time login
        await setDoc(userDocRef, {
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          level: null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          provider: 'google',
        });
        toast({
          title: 'Account Created via Google',
          description: 'Welcome to AdaptiveMind AI!',
        });
      } else {
        // Returning user
        await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        toast({
          title: 'Logged In Successfully',
          description: 'Welcome back!',
        });
      }

      // Store session info in localStorage
      localStorage.setItem('am_session_active', 'true');
      localStorage.setItem('am_user_uid', user.uid);
      if(user.email) localStorage.setItem('am_user_email', user.email);
      if(user.displayName) localStorage.setItem('am_user_name', user.displayName);

      // onAuthStateChanged will redirect to /dashboard
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
        setLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-4">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 mb-4">
                <Logo className="h-12 w-12 text-white" />
            </div>
          <h1 className="text-4xl font-bold text-white">AdaptiveMind AI</h1>
          <p className="text-lg text-[#E5E5E5]">Personalized AI Learning</p>
        </div>

        <div className="w-full space-y-4">
          <Button asChild className="w-full h-12 rounded-[18px] bg-[#1A1A1A] text-lg font-semibold text-white border border-[#2B2B2B] hover:bg-[#262626]">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="w-full h-12 rounded-[18px] bg-[#1A1A1A] text-lg font-semibold text-white border border-[#2B2B2B] hover:bg-[#262626]">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <div className="flex w-full items-center space-x-2">
          <div className="flex-grow border-t border-[#2B2B2B]"></div>
          <span className="text-sm text-[#A0A0A0]">OR</span>
          <div className="flex-grow border-t border-[#2B2B2B]"></div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-12 rounded-[18px] bg-white text-[#3C4043] border border-[#DADCE0] font-medium text-base hover:bg-gray-100"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-3 h-6 w-6" />
          )}
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
