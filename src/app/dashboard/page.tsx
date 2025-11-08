'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, User } from 'lucide-react';
import { useUser } from '@/firebase';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserProfilePanel } from '@/components/app/user-profile-panel';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  code?: string;
}

function Logo() {
  return <span className="font-medium text-white">AdaptiveMind AI</span>;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = () => {
    if (input.trim() === '' || isGenerating) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `This is a simulated response to: "${input}"`,
        sender: 'ai',
        code: input.toLowerCase().includes('code')
          ? `// Here's some example code:\nfunction greet() {\n  console.log("Hello, World!");\n}`
          : undefined,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-black">
      <header className="fixed top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#333333] bg-black/90 px-4 backdrop-blur-sm sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-gray-700 bg-transparent hover:bg-gray-800"
            >
              <User className="h-5 w-5 text-[#AAAAAA]" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[380px] bg-[#111] border-l border-[#2b2b2b] p-0 text-white">
             <UserProfilePanel />
          </SheetContent>
        </Sheet>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 overflow-y-auto px-4 pt-20 pb-32">
        {/* Ask Card */}
        <div className="rounded-2xl border border-[#2B2B2B] bg-[#111111] p-5">
          <h2 className="text-lg font-semibold text-white">Ask AdaptiveMind AI</h2>
          <p className="mb-4 text-sm text-gray-400">Type a question and press Send.</p>
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question…"
              className="min-h-[120px] w-full resize-none rounded-2xl border border-[#2B2B2B] bg-[#0F0F0F] p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-white"
            />
             <div className="absolute bottom-3 left-4 text-xs text-[#9A9A9A]">
              Shift+Enter to send
            </div>
            <div className="absolute bottom-3 right-4">
              {isGenerating ? (
                 <Button
                  variant="secondary"
                  className="rounded-lg bg-[#1A1A1A] text-white"
                  onClick={() => setIsGenerating(false)}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  className="rounded-lg bg-[#1A1A1A] text-white border border-[#3A3A3A] hover:bg-[#262626]"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Response Area */}
        <div className="rounded-2xl border border-[#252525] bg-[#0D0D0D] p-4 min-h-[200px]">
          {messages.length === 0 && !isGenerating ? (
             <div className="flex h-full items-center justify-center text-center text-gray-500">
               Ask anything like ‘Explain OOPs’ — the answer adapts to your level.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A]">
                       <svg
                         className="h-5 w-5 text-gray-400"
                         viewBox="0 0 1024 1024"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path fill="currentColor" d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m0 832a384 384 0 1 0 0-768a384 384 0 0 0 0 768m-48-528a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48-160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 144a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144-144a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144-160a48 48 0 1 1-96 0a48 48 0 0 1 96 0"/>
                       </svg>
                     </div>
                  )}
                  <div
                    className={`max-w-xl rounded-lg border p-3 ${
                      message.sender === 'user'
                        ? 'bg-[#151515] border-[#2B2B2B] text-white'
                        : 'bg-[#101010] border-[#2B2B2B] text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.code && (
                      <pre className="mt-2 rounded-md bg-[#0A0A0A] p-3 font-mono text-sm text-white border border-[#333] overflow-x-auto">
                        <code>{message.code}</code>
                      </pre>
                    )}
                  </div>
                </div>
              ))}
               {isGenerating && (
                <div className="flex items-start gap-3 justify-start">
                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A]">
                       <svg
                         className="h-5 w-5 text-gray-400"
                         viewBox="0 0 1024 1024"
                         xmlns="http://www.w3.org/2000/svg"
                       >
                         <path fill="currentColor" d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m0 832a384 384 0 1 0 0-768a384 384 0 0 0 0 768m-48-528a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48-160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 144a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144-144a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144-160a48 48 0 1 1-96 0a48 48 0 0 1 96 0"/>
                       </svg>
                     </div>
                  <div className="flex items-center space-x-1.5 rounded-lg border border-[#2B2B2B] bg-[#101010] p-3">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4">
            <Button variant="link" className="text-gray-500 hover:text-white text-sm">Clear chat</Button>
            <Button variant="link" className="text-gray-500 hover:text-white text-sm">Export</Button>
        </div>
      </main>
    </div>
  );
}
