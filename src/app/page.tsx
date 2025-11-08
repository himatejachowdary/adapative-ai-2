'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
      <Loader2 className="h-12 w-12 animate-spin" />
      <p className="mt-4 text-muted-foreground">Loading AdaptiveMind AI...</p>
    </div>
  );
}
