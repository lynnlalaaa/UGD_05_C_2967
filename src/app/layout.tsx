import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Auth System',
  description: 'Login and Register System',
};

export default function RootLayout({ children }: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen p-4">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}