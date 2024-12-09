import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/toast-provider';
import { StoreProvider } from '@/components/store-provider';
import './globals.css';
import { Metadata } from 'next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

interface Props {
  readonly children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Documenter',
  description: 'Easily manage and sign your documents with Documenter.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ToastProvider />
          <Toaster />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
