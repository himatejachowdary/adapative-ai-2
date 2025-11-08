'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
} from '@/components/ui/sheet';

export function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    // Clear local storage/cookies
    localStorage.removeItem('am_session_active');
    localStorage.removeItem('am_user_uid');
    localStorage.removeItem('am_chat_history');
    router.push('/');
  };

  return (
    <div className="flex items-center gap-4">
       <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-gray-700 bg-transparent group hover:bg-gray-800">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || `https://avatar.vercel.sh/${user?.uid}.png`} alt={user?.displayName || 'User'} />
              <AvatarFallback>
                <User className="text-[#AAAAAA] group-hover:text-white transition-colors" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        {/* SheetContent is handled in dashboard/page.tsx */}
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#1A1A1A] border-[#2B2B2B] text-white" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
              <p className="text-xs leading-none text-gray-400">
                {user?.email || 'No email'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#2B2B2B]" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-[#222]">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
