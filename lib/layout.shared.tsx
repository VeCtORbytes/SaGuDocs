import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { repoUrl } from './shared';

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 font-mono text-[15px] font-semibold tracking-tight">
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-md border border-fd-border bg-fd-card text-[11px] text-sagu-accent"
      >
        sg
      </span>
      SAGU
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Wordmark />,
    },
    githubUrl: repoUrl,
    themeSwitch: { enabled: false },
    links: [
      { text: 'Docs', url: '/docs', active: 'url' },
      { text: 'Learn', url: '/docs/learn', active: 'nested-url' },
      { text: 'Examples', url: '/docs/examples', active: 'nested-url' },
      { text: 'Demo', url: '/#demo', active: 'none' },
      { type: 'button', text: 'Get Started', url: '/docs/getting-started/quickstart', on: 'nav' },
    ],
  };
}
