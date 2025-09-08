import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ToastProvider } from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SoulConnect - AI Dating Profile Generator',
  description: 'Craft your perfect dating profile & spark meaningful connections with AI-powered bios and personalized date ideas.',
  keywords: 'dating, AI, profile generator, date ideas, Base, blockchain',
  openGraph: {
    title: 'SoulConnect - AI Dating Profile Generator',
    description: 'Craft your perfect dating profile & spark meaningful connections',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
