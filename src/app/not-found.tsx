import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <div className="glass-panel rounded-[2rem] px-8 py-12">
        <p className="text-xs font-semibold tracking-[0.2em] text-sky-deep uppercase">404</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold">That card drifted off the board.</h1>
        <p className="mt-3 text-muted-foreground">The project is missing, or the slug does not match.</p>
        <Link href="/" className={cn(buttonVariants({ variant: "gel", size: "lg" }), "mt-6")}>
          Back to the meadow
        </Link>
      </div>
    </div>
  );
}
