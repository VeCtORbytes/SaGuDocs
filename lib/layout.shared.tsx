import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { basePath, repoUrl } from './shared';

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 font-mono text-[15px] font-semibold tracking-tight">
      {/* Plain <img>: the nav renders the title twice, and inline SVG ids would collide. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${basePath}/icon.svg`} alt="" className="size-6" />
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
