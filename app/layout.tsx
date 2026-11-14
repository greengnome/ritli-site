import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ritli: a calm focus timer for iPhone',
  description:
    'Pick one thing and give it 25 minutes. Ritli is a focus timer for iPhone with tasks, real breaks, a Lock Screen timer and clear weekly stats. Download it on the App Store.',
  icons: { icon: '/ritli-icon.png', apple: '/ritli-icon.png' },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#171412' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
