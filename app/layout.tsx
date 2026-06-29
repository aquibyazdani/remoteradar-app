import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RemoteRadar — Remote Job Hunt Command Center',
  description: 'Search-string library, pipeline tracker, X-Ray builder, and resume tailor for senior remote devs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ height: '100%' }}>{children}</body>
    </html>
  );
}
