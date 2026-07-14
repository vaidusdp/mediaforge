import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6 text-center">
      <div className="max-w-md w-full bg-base-100 p-8 rounded-2xl shadow-xl border border-base-300">
        <h1 className="text-4xl font-extrabold text-primary mb-2">MediaForge</h1>
        <p className="text-base-content/70 mb-6 text-sm">
          Simple, fast, and easy-to-use tool to compress your videos and resize images for social media platforms.
        </p>
        <div className="space-y-3">
          <Link href="/home" className="btn btn-primary w-full flex items-center justify-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard / Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
