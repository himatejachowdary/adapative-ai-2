
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    async function checkUserLevel() {
      if(firestore && user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().level) {
            router.push('/dashboard');
          } else {
            setIsChecking(false);
          }
        } catch (error) {
          console.error("Error checking user level:", error);
          setIsChecking(false);
        }
      }
    }
    
    checkUserLevel();
  }, [user, isUserLoading, firestore, router]);

  const handleSelectProfession = (profession: string) => {
    setSelectedProfession(profession);
  };

  const handleContinue = async () => {
    if (!selectedProfession || !user || !firestore) return;
    setIsSaving(true);
    
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        level: selectedProfession,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      localStorage.setItem('am_user_level', selectedProfession);

      toast({
        title: 'Profession saved',
        description: 'Your learning experience will now be personalized.',
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to save profession:", error);
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: 'Could not save your profession. Please try again.',
      });
      setIsSaving(false);
    }
  };
  
  if (isChecking || isUserLoading) {
     return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-4 text-white">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white">Please select your profession</h1>
        <p className="mt-2 text-base text-[#B3B3B3]">
          This helps AdaptiveMind AI personalize better.
        </p>

        <div className="mt-12 space-y-4">
            <div
                onClick={() => handleSelectProfession('Student')}
                className={cn(
                    "flex flex-col items-center justify-center p-8 rounded-2xl border cursor-pointer transition-all duration-200",
                    selectedProfession === 'Student'
                    ? "border-[#3A3A3A] bg-[#1A1A1A] shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "border-[#2B2B2B] bg-[#111111] hover:border-[#3A3A3A]"
                )}
            >
                <BookOpen className="h-10 w-10 text-[#E5E5E5] mb-4" />
                <h2 className="text-xl font-semibold text-white">Student</h2>
            </div>
        </div>

        <div className="mt-12">
          <Button
            onClick={handleContinue}
            disabled={!selectedProfession || isSaving}
            className="h-12 w-full rounded-[20px] bg-[#1A1A1A] text-lg font-semibold text-white border border-[#3A3A3A] hover:bg-[#2C2C2C] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

    