import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kingscrockery.com'),
  title: 'Kings Crockery | Luxury Tableware, Dinner Sets & Cookware',
  description: 'Discover fine bone china, marble dinner sets, premium nonstick cookware, tea sets, and elegant dining essentials at Kings Crockery. Order easily with WhatsApp confirmation.',
  openGraph: {
    title: 'Kings Crockery | Luxury Tableware, Dinner Sets & Cookware',
    description: 'Discover fine bone china, marble dinner sets, premium nonstick cookware, tea sets, and tableware.',
    url: 'https://kingscrockery.com',
    siteName: 'Kings Crockery',
    locale: 'en_PK',
    type: 'website'
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
