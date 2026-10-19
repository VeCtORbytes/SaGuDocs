import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

const suggestions = [
  { href: '/docs', label: 'Documentation home' },
  { href: '/docs/getting-started/quickstart', label: 'Quickstart' },
  { href: '/docs/examples', label: 'Examples' },
  { href: '/docs/reference', label: 'API reference' },
];

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-24">
        <p className="font-mono text-sm text-sagu-accent">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
        <p className="mt-3 text-fd-muted-foreground">
          The link may be outdated, or the page moved when the docs were reorganized. Use search (⌘K / Ctrl K) or one of
          these:
        </p>
        <ul className="mt-6 grid gap-2">
          {suggestions.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="flex items-center justify-between rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm transition-colors hover:border-sagu-accent/60"
              >
                {s.label}
                <span aria-hidden className="text-fd-muted-foreground">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </HomeLayout>
  );
}
