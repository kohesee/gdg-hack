import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Forge - Find Your Hackathon Team',
  description: 'Match with the perfect hackathon teammates through personality-based matching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
