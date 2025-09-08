import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SoulConnect - AI Dating Profile Generator',
  description: 'Craft your perfect dating profile & spark meaningful connections with AI-powered bios and personalized date ideas.',
  keywords: 'dating, AI, profile generator, date ideas, Base, blockchain',
  authors: [{ name: 'SoulConnect Team' }],
  creator: 'SoulConnect',
  publisher: 'SoulConnect',
  robots: 'index, follow',
  openGraph: {
    title: 'SoulConnect - AI Dating Profile Generator',
    description: 'Craft your perfect dating profile & spark meaningful connections',
    type: 'website',
    siteName: 'SoulConnect',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoulConnect - AI Dating Profile Generator',
    description: 'Craft your perfect dating profile & spark meaningful connections',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
