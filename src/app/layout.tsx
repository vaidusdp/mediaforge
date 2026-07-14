import type { Metadata } from "next";
import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { Image, Upload, LayoutDashboard } from 'lucide-react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaForge",
  description: "AI-Powered Video Compressor and Social Resizer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html
        lang="en"
        data-theme="light"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-base-200">
          {userId ? (
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <aside className="w-64 bg-base-100 border-r border-base-300 flex flex-col justify-between p-4 shadow-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xl font-bold tracking-tight text-primary">MediaForge</span>
                  </div>
                  <nav className="space-y-1">
                    <Link
                      href="/home"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-base-200 text-base-content"
                    >
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                      Dashboard
                    </Link>
                    <Link
                      href="/video-upload"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-base-200 text-base-content"
                    >
                      <Upload className="w-5 h-5 text-success" />
                      Upload Video
                    </Link>
                    <Link
                      href="/social-share"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-base-200 text-base-content"
                    >
                      <Image className="w-5 h-5 text-info" />
                      Social Resizer
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                  <span className="text-xs font-semibold text-base-content/85">Profile Settings</span>
                  <UserButton />
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto bg-base-200">
                {children}
              </main>
            </div>
          ) : (
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
