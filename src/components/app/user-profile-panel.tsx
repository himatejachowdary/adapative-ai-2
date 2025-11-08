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
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { updateEmail } from 'firebase/auth';

export function UserProfilePanel() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || '');
      setEmail(user.email || '');
      // In a real app, you would fetch phone and level from Firestore
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !firestore) return;
    setIsSaving(true);
    
    try {
      // If email was changed and it's not a Google account
      if (email !== user.email && user.providerData[0]?.providerId === 'password') {
         if(auth.currentUser) {
            await updateEmail(auth.currentUser, email);
         }
      }

      await setDoc(doc(firestore, 'users', user.uid), {
        fullName: fullName,
        email: email,
        phone: phone,
        level: level,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      toast({ title: 'Profile updated' });
      setHasChanges(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
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
      <SheetHeader className="p-6">
        <SheetTitle className="text-white">Profile</SheetTitle>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetHeader>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2 bg-[#0c0c0c] border border-[#2b2b2b]">
              <TabsTrigger value="details" className="data-[state=active]:bg-[#222]">Details</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#222]">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#B5B5B5]">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={onValueChange(setFullName)} className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#B5B5B5]">Email</Label>
                <Input id="email" type="email" value={email} onChange={onValueChange(setEmail)} readOnly={user?.providerData[0]?.providerId !== 'password'} className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white read-only:opacity-70" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#B5B5B5]">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={onValueChange(setPhone)} className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level" className="text-[#B5B5B5]">Level</Label>
                <Select value={level} onValueChange={(value) => { setLevel(value); if (!hasChanges) setHasChanges(true); }}>
                  <SelectTrigger className="rounded-2xl border-[#2B2B2B] bg-[#101010] text-white">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#101010] text-white border-[#2b2b2b]">
                    <SelectItem value="student">School Student</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="employee">Software Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
             <TabsContent value="security" className="mt-6 space-y-4">
                 <p className="text-center text-gray-400">Security settings coming soon.</p>
             </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="sticky bottom-0 bg-[#111] p-6 border-t border-[#2b2b2b]">
          <div className="flex w-full gap-4">
            <SheetClose asChild>
              <Button variant="outline" className="w-full border-[#2B2B2B] text-white hover:bg-gray-800">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="w-full bg-[#1A1A1A] border-[#3A3A3A] text-white hover:bg-[#262626]">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </SheetFooter>
      </div>
    </>
  );
}
