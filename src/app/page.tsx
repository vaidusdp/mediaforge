import Link from "next/link";
import { LayoutDashboard, LogIn } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6 text-center">
      <div className="max-w-md w-full bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300">
        <h1 className="text-4xl font-extrabold text-primary mb-2">MediaForge</h1>
        <p className="text-base-content/70 mb-6 text-sm">
          Simple, fast, and easy-to-use tool to compress your videos and resize images for social media platforms.
        </p>
        <div className="space-y-3">
          {userId ? (
            <Link href="/home" className="btn btn-primary w-full flex items-center justify-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/sign-in" className="btn btn-primary w-full flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
