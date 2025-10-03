import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import AdminLayout from '@/components/admin/AdminLayout';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MASAPP Admin - Super Admin Panel',
  description: 'MASAPP Super Admin Management Panel',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
