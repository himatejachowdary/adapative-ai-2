
import { cn } from "@/lib/utils"

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("w-8 h-8", className)}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m0 832a384 384 0 1 0 0-768a384 384 0 0 0 0 768m-48-528a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48-160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 144a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144-144a48 48 0 1 1-96 0a48 48 0 0 1 96 0m-48 160a48 48 0 1 1-96 0a48 48 0 0 1 96 0m144-160a48 48 0 1 1-96 0a48 48 0 0 1 96 0"
      />
    </svg>
  );
}
