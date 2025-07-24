import React from 'react';
import CBLHeader from '@/components/CBLHeader';

interface CBLLayoutProps {
  children: React.ReactNode;
}

export default function CBLLayout({ children }: CBLLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* CBL Header */}
      <CBLHeader />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}