import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50 p-4">
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">MediaForge</h2>
          <p className="text-blue-700/80 text-sm mt-1">AI-Powered Media Management</p>
        </div>
        <div className="w-full flex justify-center drop-shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
}
