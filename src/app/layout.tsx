import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Newspaper Subscription',
  description: 'Subscribe to printed newspaper, e-paper, or website access',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <SubscriptionProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SubscriptionProvider>
      </body>
    </html>
  );
}
