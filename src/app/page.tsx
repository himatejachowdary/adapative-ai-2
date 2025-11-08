import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/auth/animated-background";
import Logo from "@/components/auth/logo";
import GoogleIcon from "@/components/icons/google";
import GithubIcon from "@/components/icons/github";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <Logo />
          </div>

          <h1 className="font-headline text-5xl md:text-6xl font-bold text-glow-primary">
            AdaptiveMind AI
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground text-glow-accent font-medium">
            Personalized AI Learning for Every Mind
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 w-full max-w-xs">
          <Button asChild className="w-full text-lg py-6 glassmorphic button-glow-primary">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="w-full text-lg py-6 glassmorphic button-glow-accent">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-foreground/60">or continue with</p>
          <div className="flex gap-6">
            <Link href="#" aria-label="Login with Google">
              <GoogleIcon className="h-10 w-10 text-foreground icon-glow-primary" />
            </Link>
            <Link href="#" aria-label="Login with GitHub">
              <GithubIcon className="h-10 w-10 text-foreground icon-glow-accent" />
            </Link>
          </div>
        </div>

        <footer className="absolute bottom-4 text-center text-sm text-foreground/40">
          © 2025 AdaptiveMind AI — Empowering Smart Learning
        </footer>
      </main>
    </>
  );
}
