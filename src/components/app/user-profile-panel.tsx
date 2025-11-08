'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export function UserProfilePanel() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isGoogleProvider = user?.providerData[0]?.providerId === 'google.com';

  useEffect(() => {
    async function loadUserProfile() {
      if (!user || !firestore) return;
      setIsLoading(true);
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFullName(userData.fullName || user.displayName || '');
          setEmail(userData.email || user.email || '');
          setPhone(userData.phone || '');
          setLevel(userData.level || '');
        } else {
            // Fallback for users that might exist in auth but not firestore
            setFullName(user.displayName || '');
            setEmail(user.email || '');
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast({
            variant: 'destructive',
            title: 'Failed to load profile',
            description: 'Could not fetch your data from the server.'
        })
      } finally {
        setIsLoading(false);
        setHasChanges(false);
      }
    }
    loadUserProfile();
  }, [user, firestore, toast]);

  const handleSave = async () => {
    if (!user || !firestore) return;
    setIsSaving(true);
    
    try {
      if (email !== user.email && !isGoogleProvider && auth.currentUser) {
         // This is a sensitive operation and may require re-authentication.
         // For this implementation, we will assume re-authentication is handled if needed.
         // In a real app, you would prompt for the user's password.
         await updateEmail(auth.currentUser, email);
      }

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        fullName: fullName,
        email: email,
        phone: phone,
        level: level,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      // Update localStorage
      localStorage.setItem('am_user_name', fullName);
      localStorage.setItem('am_user_level', level);
      
      toast({ title: 'Profile updated successfully' });
      setHasChanges(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Profile update failed',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onValueChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string | React.ChangeEvent<HTMLInputElement>) => {
    const val = typeof value === 'string' ? value : value.target.value;
    setter(val);
    if (!hasChanges) setHasChanges(true);
  }

  return (
    <>
      <SheetHeader className="p-6 border-b border-[#2b2b2b]">
        <SheetTitle className="text-white">Profile</SheetTitle>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetHeader>
      <div className="flex h-full flex-col">
        {isLoading ? (
             <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
        ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2 bg-[#0c0c0c] border border-[#2b2b2b]">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#222]">Details</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#222]" disabled>Security</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#B5B5B5]">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={onValueChange(setFullName)} className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#B5B5B5]">Email</Label>
                <Input id="email" type="email" value={email} onChange={onValueChange(setEmail)} readOnly={isGoogleProvider} className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white read-only:opacity-70 read-only:cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#B5B5B5]">Phone</Label>
                <Input id="phone" type="tel" placeholder="Your phone number" value={phone} onChange={onValueChange(setPhone)} className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-[#B5B5B5]">Level</Label>
                <Select value={level} onValueChange={(value) => { setLevel(value); if (!hasChanges) setHasChanges(true); }}>
                  <SelectTrigger className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#101010] text-white border-[#2b2b2b]">
                    <SelectItem value="School Student">School Student</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Software Employee">Software Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
             <TabsContent value="security" className="mt-6 space-y-4">
                 <p className="text-center text-gray-400">Security settings coming soon.</p>
             </TabsContent>
          </Tabs>
        </div>
        )}
        <SheetFooter className="sticky bottom-0 bg-[#111] p-6 border-t border-[#2b2b2b]">
          <div className="flex w-full gap-4">
            <SheetClose asChild>
              <Button variant="outline" className="w-full border-[#2B2B2B] text-white hover:bg-gray-800">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving || isLoading} className="w-full bg-[#1A1A1A] border-[#3A3A3A] text-white hover:bg-[#262626]">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </SheetFooter>
      </div>
    </>
  );
}
