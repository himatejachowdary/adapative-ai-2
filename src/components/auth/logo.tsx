
import { cn } from "@/lib/utils"

export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-medium text-white", className)}>AdaptiveMind AI</span>
  );
}
