import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  Boxes,
  Braces,
  Database,
  GitBranch,
  Radio,
  Repeat,
  ScanSearch,
  ShieldCheck,
  Shuffle,
  Wrench,
} from 'lucide-react';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { ArchitectureOverview } from '@/components/diagrams';
import { AgentDemo } from '@/components/agent-demo';
import { cloneCommand, repoUrl, sourceUrl } from '@/lib/shared';

// Condensed from examples/01-basic-tool-agent/index.ts (same API, shorter tool body).
const heroCode = `import { z } from "zod";
import { Agent, defineTool, mock } from "../src/index.ts";

const calculate = defineTool({
  name: "calculate",
  description: "Evaluate a math expression.",
  input: z.object({ expression: z.string() }),
  execute: async ({ expression }) => ({ expression, result: 1000 }),
});

const agent = new Agent({
  name: "MathAssistant",
  instructions: "Use the calculate tool for math.",
  // Scripted model, no API key. Swap for anthropic().
  model: mock([
    { toolCalls: [{ id: "c1", name: "calculate",
        arguments: { expression: "125 * 8" } }] },
    "125 multiplied by 8 equals 1,000.",
  ]),
  tools: [calculate],
});

// Never throws on expected failures.
const result = await agent.run("What is 125 * 8?");
if (result.success) console.log(result.output);
else console.error(result.error.code);`;

const attributes = [
  { k: 'language', v: 'TypeScript, ESM' },
  { k: 'runtime dep', v: 'zod (neo4j-driver optional)' },
  { k: 'providers', v: 'Mock · Anthropic · OpenAI · Gemini' },
  { k: 'graph memory', v: 'Neo4j + 3 background processes' },
  { k: 'tests', v: 'node --test, no API keys' },
  { k: 'license', v: 'MIT' },
];

const features: { icon: ReactNode; title: string; body: string; href: string }[] = [
  {
    icon: <Repeat />,
    title: 'Agent runtime & tools',
    body: 'One readable loop in runner.ts. Zod-validated tool arguments, async tools, per-tool timeouts, maxTurns stop.',
    href: '/docs/features/tools',
  },
  {
    icon: <Shuffle />,
    title: 'Multi-agent handoffs',
    body: 'Synthetic transfer_to_* tools switch the active agent inside one run, capped by maxHandoffs.',
    href: '/docs/features/handoffs',
  },
  {
    icon: <ShieldCheck />,
    title: 'Guardrails & tool approval',
    body: 'Input, output and tool guardrails that block or rewrite, plus requiresApproval for risky tools.',
    href: '/docs/features/guardrails',
  },
  {
    icon: <Braces />,
    title: 'Structured output & repair',
    body: 'Agent<T> with a Zod outputSchema. Invalid JSON gets the validation errors fed back for a retry.',
    href: '/docs/features/structured-output',
  },
  {
    icon: <Database />,
    title: 'Self-maintaining graph memory',
    body: 'Facts in Neo4j kept clean by three background processes: extract, infer relationships, merge/resolve/prune. Plus session history.',
    href: '/docs/features/background-processes',
  },
  {
    icon: <Radio />,
    title: 'Streaming events',
    body: 'agent.stream() yields text_delta, tool_start, tool_end, handoff, guardrail_triggered, run_completed, run_failed.',
    href: '/docs/features/streaming',
  },
  {
    icon: <ScanSearch />,
    title: 'Tracing',
    body: 'Span tree for every run: model calls, tools, guardrails, handoffs, session I/O. Console and JSON exporters.',
    href: '/docs/features/tracing',
  },
  {
    icon: <Wrench />,
    title: 'Retry, timeout, redaction',
    body: 'withRetry (backoff + jitter), withTimeout, and redactSecrets applied to every trace.',
    href: '/docs/features/reliability',
  },
  {
    icon: <Boxes />,
    title: 'Providers & fallback',
    body: 'A small ModelProvider interface, fetch-based adapters, and fallback() to chain providers in order.',
    href: '/docs/features/providers',
  },
];

const examples = [
  {
    path: 'examples/01-basic-tool-agent',
    title: 'Basic tool agent',
    body: 'Two Zod tools, a scripted model, ConsoleExporter trace output, token usage.',
  },
  {
    path: 'examples/02-support-triage-handoff',
    title: 'Support triage handoff',
    body: 'Triage agent hands off to a billing specialist; consumes agent.stream() events.',
  },
  {
    path: 'examples/03-structured-output-and-memory',
    title: 'Structured output & SQLite memory',
    body: 'Agent<LeadProfile> recovers from an invalid response via schema repair; history kept in SqliteSession.',
  },
  {
    path: 'examples/04-graph-memory-longterm-recall',
    title: 'Graph memory recall',
    body: 'One agent stores facts with remember_fact; a second agent with no chat history recalls them.',
  },
  {
    path: 'examples/05-background-graph-memory',
    title: 'Background graph memory',
    body: 'Runs return instantly while three processes extract facts, infer edges, merge duplicates and resolve conflicts.',
  },
];

function SectionHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-wider text-sagu-accent">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {children ? <p className="mt-3 text-fd-muted-foreground">{children}</p> : null}
    </div>
  );
}

function ButtonLink({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  const external = href.startsWith('http');
  const className = primary
    ? 'inline-flex items-center gap-2 rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90'
    : 'inline-flex items-center gap-2 rounded-md border border-fd-border bg-fd-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-sagu-accent/60';
  return external ? (
    <a href={href} className={className} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-grid border-b border-fd-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 font-mono text-xs text-fd-muted-foreground">
              <GitBranch className="size-3.5 text-sagu-accent" aria-hidden />
              v0.1.0 · open source · run from source
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Build agents.
              <br />
              <span className="text-fd-muted-foreground">Understand every layer.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fd-muted-foreground">
              SAGU is an open-source TypeScript SDK for building AI agents, with a runtime designed to remain
              understandable, extensible, and independent of a single model vendor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/docs/getting-started/quickstart" primary>
                Get Started <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={repoUrl}>Clone on GitHub</ButtonLink>
            </div>
            <p className="mt-4 font-mono text-xs text-fd-muted-foreground">
              <span className="select-none text-sagu-accent">$ </span>
              {cloneCommand}
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {attributes.map((a) => (
                <div key={a.k}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fd-muted-foreground">{a.k}</dt>
                  <dd className="mt-0.5 text-sm">{a.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-2">
                <span className="truncate font-mono text-xs text-fd-muted-foreground">examples/01-basic-tool-agent (condensed)</span>
                <a
                  href={sourceUrl('examples/01-basic-tool-agent/index.ts')}
                  className="shrink-0 font-mono text-xs text-sagu-accent hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  source ↗
                </a>
              </div>
              <div className="[&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0">
                <ServerCodeBlock lang="ts" code={heroCode} themes={{ light: 'github-light', dark: 'github-dark' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader kicker="architecture" title="A library in your process, not a hosted service">
            Your application owns the process and the credentials. SAGU runs the loop between your code, the model
            provider you configure, and the tools you define.
          </SectionHeader>
          <ArchitectureOverview />
          <Link href="/docs/learn/agent-loop" className="inline-flex items-center gap-1 text-sm text-sagu-accent hover:underline">
            Walk through the agent loop step by step <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader kicker="features" title="What's implemented today">
            Every card links to a page with a verified example and its limitations.
          </SectionHeader>
          <ul className="grid gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li key={f.title} className="bg-fd-background">
                <Link href={f.href} className="group flex h-full flex-col p-5 transition-colors hover:bg-fd-card">
                  <span className="text-sagu-accent [&_svg]:size-5" aria-hidden>
                    {f.icon}
                  </span>
                  <h3 className="mt-3 font-medium">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">{f.body}</p>
                  <span className="mt-auto pt-4 text-xs text-fd-muted-foreground group-hover:text-sagu-accent">Read docs →</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-fd-muted-foreground">
            Not yet: token-level streaming from real providers, semantic (vector) retrieval, and an npm release. See{' '}
            <Link href="/docs/contributing/limitations" className="text-sagu-accent hover:underline">
              known limitations
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="scroll-mt-20 border-b border-fd-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader kicker="interactive" title="See the loop, step by step">
              A scripted, in-browser simulation. It does not call a model or run SAGU. It shows the order of events the real
              runtime emits: the model asks for a tool, the runtime executes it, and the result goes back to the model.
            </SectionHeader>
            <ButtonLink href="/docs/learn/tool-calls">How tool calls really work</ButtonLink>
          </div>
          <AgentDemo />
        </div>
      </section>

      {/* Examples */}
      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader kicker="examples" title="Five runnable examples">
            All run offline with the scripted MockProvider: <code className="font-mono text-sm">node examples/&lt;name&gt;/index.ts</code>
          </SectionHeader>
          <ul className="grid gap-4 md:grid-cols-2">
            {examples.map((e) => (
              <li key={e.path} className="flex flex-col rounded-xl border border-fd-border bg-fd-card p-5">
                <p className="font-mono text-xs text-sagu-accent">{e.path}</p>
                <h3 className="mt-2 font-medium">{e.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">{e.body}</p>
                <div className="mt-4 flex gap-4 text-sm">
                  <Link href={`/docs/examples/${e.path.split('/')[1]!.slice(3)}`} className="text-sagu-accent hover:underline">
                    Walkthrough
                  </Link>
                  <a href={sourceUrl(e.path)} target="_blank" rel="noreferrer noopener" className="text-fd-muted-foreground hover:text-fd-foreground">
                    Source ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Read the loop. Then build on it.</h2>
          <p className="mx-auto mt-3 max-w-xl text-fd-muted-foreground">
            Clone the repository, run the examples without API keys, then plug in your own provider credentials.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/docs" primary>
              Read the documentation
            </ButtonLink>
            <ButtonLink href="/docs/examples">Browse examples</ButtonLink>
            <ButtonLink href={repoUrl}>Clone the repository</ButtonLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-fd-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-fd-muted-foreground sm:px-6">
          <span className="font-mono">SAGU · MIT License · by Sarthak Gupta</span>
          <div className="flex gap-5">
            <Link href="/docs" className="hover:text-fd-foreground">
              Docs
            </Link>
            <Link href="/docs/reference" className="hover:text-fd-foreground">
              API
            </Link>
            <a href={repoUrl} className="hover:text-fd-foreground" target="_blank" rel="noreferrer noopener">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
