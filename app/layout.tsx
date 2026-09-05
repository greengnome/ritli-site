import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Swish — A little focus. A lot forward.',
  description: 'Make room for what matters. Swish brings focus timers, thoughtful task planning, and clear progress insights together on your iPhone. Coming soon.',
  icons: { icon: '/swish-icon.png', apple: '/swish-icon.png' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
