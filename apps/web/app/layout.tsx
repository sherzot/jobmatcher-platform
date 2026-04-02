import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/auth-context';

export const metadata: Metadata = {
  title: 'JobMatch Platform — 日本・ウズベキスタン求人',
  description: 'AI-powered job matching for Japan and Uzbekistan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
