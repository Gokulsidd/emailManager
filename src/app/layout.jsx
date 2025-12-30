import { Suspense } from 'react';
import './globals.css';
import AppInitializer from '@/components/AppInitializer';

export const metadata = {
  title: 'Email Configuration Manager',
  description: 'Manage email configurations and profiles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <Suspense fallback={null}>
          <AppInitializer />
        </Suspense>
        <div className="h-full w-full flex flex-col bg-gray-100 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}