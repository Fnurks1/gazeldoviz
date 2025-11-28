import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gazel Döviz - Güvenilir Döviz Bürosu',
  description: 'Anlık döviz kurları, güvenilir döviz alım-satım işlemleri ve profesyonel hizmet. Gazel Döviz ile en güncel kurları takip edin.',
  keywords: ['döviz', 'döviz bürosu', 'döviz kuru', 'exchange', 'currency', 'TL', 'USD', 'EUR'],
  authors: [{ name: 'Gazel Döviz' }],
  openGraph: {
    title: 'Gazel Döviz - Güvenilir Döviz Bürosu',
    description: 'Anlık döviz kurları ve güvenilir döviz alım-satım işlemleri',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gazel Döviz',
    description: 'Anlık döviz kurları ve güvenilir döviz alım-satım işlemleri',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
