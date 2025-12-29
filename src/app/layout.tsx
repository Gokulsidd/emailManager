import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import AppInitializer from '@/components/AppInitializer';

export const metadata: Metadata = {
  title: 'Email Configuration Manager',
  description: 'Manage email configurations and profiles',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden"> {/* Contain the app to the screen */}
        <Suspense fallback={null}>
          <AppInitializer />
        </Suspense>
        {/* Fix: Remove the broken nested div string and use h-full */}
        <div className="h-full w-full flex flex-col bg-gray-100 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}