import Link from "next/link";
import { Car, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      <nav className="flex items-center justify-between p-6 border-b border-border bg-card/80 backdrop-blur-sm">
        <span className="font-bold text-primary text-xl tracking-tighter flex items-center gap-2">
          <Car className="size-6 text-primary" />
          NIPPON
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">Nippon Toyota</h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            Manage your automotive operations with precision and speed.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button size="lg" asChild className="rounded-full gap-2 px-8">
            <Link href="/register">
              <UserPlus className="size-5" />
              Get Started
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-full gap-2 px-8">
            <Link href="/login">
              <LogIn className="size-5" />
              Sign In
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
