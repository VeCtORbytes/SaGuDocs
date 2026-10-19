import { Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import './global.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-jb' });

export const metadata: Metadata = {
  title: {
    default: 'SAGU — TypeScript AI Agent SDK',
    template: '%s · SAGU',
  },
  description:
    'SAGU is an open-source TypeScript SDK for building AI agents with a readable runtime and pluggable model providers.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${mono.variable}`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
