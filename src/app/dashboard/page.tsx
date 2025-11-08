'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Logo from '@/components/auth/logo';
import { Send, User } from 'lucide-react';
import { ProfileModal } from '@/components/app/profile-modal';
import Link from 'next/link';
import { useUser } from '@/firebase';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  code?: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProfileOpen, setProfileOpen] = useState(false);

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);

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
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex h-screen w-full flex-col bg-black">
      <header className="fixed top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#333333] bg-black/80 px-4 backdrop-blur-sm sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-white" />
          <span className="text-lg font-bold text-white">AdaptiveMind AI</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full glassmorphic soft-glow-border group"
          onClick={() => setProfileOpen(true)}
        >
          <User className="h-5 w-5 text-[#AAAAAA] transition-colors group-hover:text-white" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto pt-16 pb-24">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="opacity-50">
              <Logo className="h-24 w-24 text-gray-400" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">
              Welcome, {user?.displayName || 'User'}
            </h1>
            <p className="text-[#AAAAAA]">How can I help you learn today?</p>
          </div>
        ) : (
          <div className="space-y-6 p-4 sm:p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="h-8 w-8 flex-shrink-0">
                    <Logo className="h-full w-full text-white" />
                  </div>
                )}
                <div
                  className={`max-w-md rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#2A2A2A] text-white'
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
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 z-20 w-full p-4">
        <div className="relative mx-auto max-w-3xl">
          <div className="glassmorphic soft-glow-border flex w-full items-center rounded-[18px] p-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send a prompt to your Adaptive AI..."
              className="flex-1 resize-none border-none bg-transparent !ring-0 !ring-offset-0 placeholder:text-[#888888] focus:!ring-0"
              rows={1}
            />
            <Button
              size="icon"
              className={`h-10 w-10 flex-shrink-0 rounded-full glassmorphic transition-all ${
                input.trim()
                  ? 'soft-glow-border'
                  : ''
              }`}
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send
                className={`h-5 w-5 transition-colors ${
                  input.trim() ? 'text-white' : 'text-[#AAAAAA]'
                }`}
              />
            </Button>
          </div>
        </div>
      </footer>
      <ProfileModal isOpen={isProfileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
