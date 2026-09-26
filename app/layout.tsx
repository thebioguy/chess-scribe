import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chess Scribe',
  description: 'A personal chess score sheet scanner that learns your handwriting and reconstructs games.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
