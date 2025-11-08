"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, X } from "lucide-react";
import Link from "next/link";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";

interface ProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ isOpen, onOpenChange }: ProfileModalProps) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    onOpenChange(false);
    router.push('/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphic text-white max-w-md">
         <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full w-8 h-8 glassmorphic flex items-center justify-center soft-glow-border">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        <DialogHeader className="items-center text-center space-y-4 pt-6">
            <Avatar className="h-24 w-24 border-2 border-white/20">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'}/>}
                <AvatarFallback className="bg-[#1A1A1A]">
                    <User className="h-12 w-12 text-[#AAAAAA]" />
                </AvatarFallback>
            </Avatar>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-bold">{user?.displayName || 'User'}</DialogTitle>
            <p className="text-[#AAAAAA] text-sm">{user?.email || 'No email provided'}</p>
          </div>
        </DialogHeader>
        
        <Separator className="my-4 border-[#333333]" />

        <div className="space-y-3 px-6 pb-4">
            <h3 className="font-semibold text-white mb-3 text-sm">Personal Information</h3>
            <div className="flex justify-between text-sm">
                <span className="text-[#AAAAAA]">Full Name:</span>
                <span className="font-medium text-white">{user?.displayName || 'Not provided'}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-[#AAAAAA]">Email:</span>
                <span className="font-medium text-white">{user?.email || 'Not provided'}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-[#AAAAAA]">Phone:</span>
                <span className="font-medium text-white">{user?.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-[#AAAAAA]">Account Type:</span>
                <span className="font-medium text-white">{user?.providerData?.[0]?.providerId === 'password' ? 'Email Account' : 'Google Account'}</span>
            </div>
        </div>

        <Separator className="my-4 border-[#333333]" />

        <div className="px-6 pb-6">
            <Button onClick={handleLogout} variant="secondary" className="w-full bg-[#1A1A1A] text-white hover:bg-[#222] soft-glow-border">
              Logout
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
