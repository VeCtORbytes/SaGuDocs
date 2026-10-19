import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import type { MDXComponents } from 'mdx/types';
import { FileCode2 } from 'lucide-react';
import { ArchitectureOverview, HandoffDiagram, MemoryDiagram, ProviderDiagram, RuntimeDiagram } from './diagrams';
import { sourceUrl } from '@/lib/shared';

/** Inline link to a file in the SDK repository, e.g. <Source path="src/runner.ts" />. */
function Source({ path, label }: { path: string; label?: string }) {
  return (
    <a
      href={sourceUrl(path)}
      target="_blank"
      rel="noreferrer noopener"
      className="not-prose inline-flex items-center gap-1 rounded border border-fd-border bg-fd-card px-1.5 py-0.5 align-middle font-mono text-[12.5px] text-fd-foreground no-underline transition-colors hover:border-sagu-accent/60"
    >
      <FileCode2 className="size-3.5 text-sagu-accent" aria-hidden />
      {label ?? path}
    </a>
  );
}

/** "Related source" footer list used at the bottom of feature pages. */
function SourceList({ paths }: { paths: string[] }) {
  return (
    <ul className="not-prose my-4 flex flex-wrap gap-2">
      {paths.map((p) => (
        <li key={p}>
          <Source path={p} />
        </li>
      ))}
    </ul>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    Source,
    SourceList,
    ArchitectureOverview,
    RuntimeDiagram,
    ProviderDiagram,
    MemoryDiagram,
    HandoffDiagram,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
