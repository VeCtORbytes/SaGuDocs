import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'app' | 'runtime' | 'model' | 'tool' | 'store' | 'muted' | 'error';

const toneClass: Record<Tone, string> = {
  app: 'border-sagu-blue/40 bg-sagu-blue/[0.06]',
  runtime: 'border-sagu-accent/45 bg-sagu-accent/[0.07]',
  model: 'border-fd-border bg-fd-card',
  tool: 'border-sagu-green/40 bg-sagu-green/[0.06]',
  store: 'border-sagu-amber/40 bg-sagu-amber/[0.06]',
  muted: 'border-dashed border-fd-border bg-transparent',
  error: 'border-fd-error/50 bg-fd-error/[0.06]',
};

const toneLabel: Record<Tone, string> = {
  app: 'text-sagu-blue',
  runtime: 'text-sagu-accent',
  model: 'text-fd-muted-foreground',
  tool: 'text-sagu-green',
  store: 'text-sagu-amber',
  muted: 'text-fd-muted-foreground',
  error: 'text-fd-error',
};

function Box({
  tone,
  kicker,
  title,
  children,
  className,
}: {
  tone: Tone;
  kicker?: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-lg border px-3.5 py-3 text-left', toneClass[tone], className)}>
      {kicker ? (
        <p className={cn('mb-1 font-mono text-[10.5px] uppercase tracking-wider', toneLabel[tone])}>{kicker}</p>
      ) : null}
      <p className="text-sm font-medium text-fd-foreground">{title}</p>
      {children ? <div className="mt-1 text-[13px] leading-relaxed text-fd-muted-foreground">{children}</div> : null}
    </div>
  );
}

/** Vertical arrow on mobile, horizontal on wide screens when `responsive` is set. */
function Arrow({ label, responsive = false }: { label?: string; responsive?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center gap-2 font-mono text-[11px] text-fd-muted-foreground',
        responsive ? 'py-1 md:px-1 md:py-0' : 'py-1',
      )}
    >
      <span className={cn(responsive && 'md:hidden')}>↓</span>
      {responsive ? <span className="hidden md:inline">→</span> : null}
      {label ? <span>{label}</span> : null}
    </div>
  );
}

function Figure({ label, caption, children }: { label: string; caption: ReactNode; children: ReactNode }) {
  return (
    <figure aria-label={label} className="not-prose my-8 rounded-xl border border-fd-border bg-fd-background p-4 sm:p-6">
      {children}
      <figcaption className="mt-5 border-t border-fd-border pt-3 text-[13px] leading-relaxed text-fd-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-fd-muted px-1 py-0.5 font-mono text-[12px] text-fd-foreground">{children}</code>;
}

/* ------------------------------------------------------------------ */
/* Homepage / introduction overview                                    */
/* ------------------------------------------------------------------ */

export function ArchitectureOverview() {
  return (
    <Figure
      label="SAGU architecture overview"
      caption={
        <>
          SAGU is a library that runs inside your Node.js process. It does not host a model and ships no
          end-user chat UI: your code calls <Code>agent.run()</Code>, and SAGU calls the provider you
          configured with your own credentials. Graph memory is reached through two tools the model can call.
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1.4fr_auto_1fr] md:items-center">
        <Box tone="app" kicker="your code" title="Your application">
          CLI, server route, worker or test. Calls <Code>agent.run()</Code> or iterates <Code>agent.stream()</Code>.
        </Box>
        <Arrow responsive label="input" />
        <div className="rounded-xl border border-sagu-accent/40 p-3">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-sagu-accent">sagu runtime</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Box tone="runtime" title="Agent">
              Immutable config: instructions, model, tools, handoffs, guardrails, schema.
            </Box>
            <Box tone="runtime" title="Runner loop">
              Turns, tool dispatch, handoffs, repair, events, trace spans.
            </Box>
          </div>
        </div>
        <Arrow responsive label="request" />
        <Box tone="model" kicker="provider adapter" title="ModelProvider">
          Mock, Anthropic, OpenAI, Gemini or a fallback chain → the vendor&apos;s HTTP API.
        </Box>
      </div>
      <div className="mt-3 grid gap-3 md:ml-[22%] md:mr-[22%] md:grid-cols-2">
        <Box tone="tool" kicker="executed by runner" title="Your tools">
          <Code>defineTool()</Code> functions. Arguments validated with Zod before <Code>execute</Code> runs.
          Optional: <Code>remember_fact</Code> / <Code>recall_facts</Code> → graph memory.
        </Box>
        <Box tone="store" kicker="optional" title="Session store">
          History loaded before a run and appended after a successful run (in-memory, JSON file or SQLite).
        </Box>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram A — agent runtime                                           */
/* ------------------------------------------------------------------ */

export function RuntimeDiagram() {
  return (
    <Figure
      label="Diagram A: the SAGU agent runtime loop"
      caption={
        <>
          Mirrors <Code>streamAgent()</Code> in <Code>src/runner.ts</Code>. <Code>agent.run()</Code> drains the same
          event stream, so both entry points share one loop. Tool failures are returned to the model as error results;
          they do not end the run.
        </>
      }
    >
      <ol className="mx-auto grid max-w-xl gap-0">
        <li>
          <Box tone="app" kicker="1 · your code" title={<>agent.run(&quot;What is 125 * 8?&quot;)</>}>
            Optional: load prior history from a <Code>SessionStore</Code>, then run input guardrails.
          </Box>
        </li>
        <Arrow />
        <li className="rounded-xl border border-dashed border-sagu-accent/50 p-3">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-sagu-accent">
            loop · repeats until a final answer or maxTurns (default 10)
          </p>
          <div className="grid gap-0">
            <Box tone="runtime" kicker="2 · runner" title="Build the request">
              System instructions (+ JSON schema if <Code>outputSchema</Code>), message history, tool specs including
              synthetic <Code>transfer_to_*</Code> handoff tools.
            </Box>
            <Arrow />
            <Box tone="model" kicker="3 · model provider" title="Model decides">
              Returns text, or one or more tool calls such as <Code>calculate({'{'} expression: &quot;125 * 8&quot; {'}'})</Code>.
            </Box>
            <Arrow label="tool calls?" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Box tone="tool" kicker="4a · yes → runtime" title="Execute each tool call">
                Tool guardrails → approval (if <Code>requiresApproval</Code>) → Zod validation → <Code>execute()</Code>{' '}
                with optional timeout. Result appended as a <Code>tool</Code> message, then back to step 2.
              </Box>
              <Box tone="runtime" kicker="4b · no → runtime" title="Finalize text">
                Parse against <Code>outputSchema</Code> (repair prompt on failure), then output guardrails.
              </Box>
            </div>
          </div>
        </li>
        <Arrow />
        <li>
          <Box tone="app" kicker="5 · your code" title="RunResult">
            <Code>{'{ success: true, output, messages, usage, turns, trace }'}</Code> or{' '}
            <Code>{'{ success: false, error, … }'}</Code>. New messages are saved to the session store only on success.
          </Box>
        </li>
      </ol>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram B — provider abstraction                                    */
/* ------------------------------------------------------------------ */

const adapters = [
  { name: 'MockProvider', fn: 'mock([...])', target: 'Scripted turns, in-process. No network.' },
  { name: 'AnthropicProvider', fn: 'anthropic()', target: 'POST {baseURL}/messages · api.anthropic.com/v1' },
  { name: 'OpenAIProvider', fn: 'openai()', target: 'POST {baseURL}/chat/completions · api.openai.com/v1' },
  {
    name: 'GeminiProvider',
    fn: 'gemini()',
    target: 'POST {baseURL}/models/{model}:generateContent · generativelanguage.googleapis.com/v1beta',
  },
];

export function ProviderDiagram() {
  return (
    <Figure
      label="Diagram B: provider abstraction"
      caption={
        <>
          The runner only knows the <Code>ModelProvider</Code> interface. Each adapter translates SAGU messages and
          tool specs into the vendor&apos;s wire format with <Code>fetch</Code>. <Code>FallbackProvider</Code> is itself a{' '}
          <Code>ModelProvider</Code> that tries a list of providers in order.
        </>
      }
    >
      <div className="mx-auto max-w-2xl">
        <Box tone="runtime" kicker="runner" title="streamAgent() builds a ProviderRequest">
          <Code>{'{ messages, systemPrompt, tools, temperature, outputSchema, abortSignal }'}</Code>
        </Box>
        <Arrow />
        <Box tone="runtime" kicker="contract · src/types.ts" title="interface ModelProvider">
          <Code>name</Code>, <Code>generate(request)</Code>, optional <Code>stream(request)</Code>
        </Box>
        <Arrow label="implemented by" />
        <div className="rounded-xl border border-dashed border-fd-border p-3">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wider text-fd-muted-foreground">
            optional wrapper · fallback(primary, ...rest)
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {adapters.map((a) => (
              <li key={a.name}>
                <Box tone="model" kicker={a.fn} title={a.name}>
                  <span className="break-words font-mono text-[11.5px]">{a.target}</span>
                </Box>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram C — memory                                                  */
/* ------------------------------------------------------------------ */

export function MemoryDiagram() {
  return (
    <Figure
      label="Diagram C: session history and graph memory are separate systems"
      caption={
        <>
          Session history is wired into the runner through <Code>RunOptions</Code>. Graph memory is not: the model reaches
          it only by calling the <Code>remember_fact</Code> / <Code>recall_facts</Code> tools created by{' '}
          <Code>createGraphMemoryTools(store)</Code>. Nothing extracts facts automatically.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <Box tone="store" kicker="SessionStore · conversation history" title="What was said, in order">
            <Code>Message[]</Code> keyed by <Code>sessionId</Code>. Loaded before the run, new messages appended after a
            successful run.
          </Box>
          <ul className="grid gap-2">
            <li>
              <Box tone="muted" title="InMemorySession">Lives until the process exits.</Box>
            </li>
            <li>
              <Box tone="muted" title="FileSession">JSON file per session in <Code>./.sagu_sessions</Code>.</Box>
            </li>
            <li>
              <Box tone="muted" title="SqliteSession">
                <Code>node:sqlite</Code>; persistent with a filename, ephemeral with <Code>:memory:</Code> (default).
              </Box>
            </li>
          </ul>
        </div>
        <div className="grid content-start gap-2">
          <Box tone="tool" kicker="GraphMemoryStore · long-term facts" title="What is true, as triplets">
            <Code>subject → predicate → object</Code>, shared across sessions and agents that hold the same store.
          </Box>
          <ul className="grid gap-2">
            <li>
              <Box tone="muted" title="InMemoryGraphMemoryStore">
                Array in memory; lost on restart. Case-insensitive dedupe of identical triplets.
              </Box>
            </li>
            <li>
              <Box tone="muted" title="Neo4jGraphMemoryStore">
                <Code>(:Entity)-[:RELATION {'{type}'}]-&gt;(:Entity)</Code> via <Code>MERGE</Code>; persists in Neo4j.
              </Box>
            </li>
          </ul>
        </div>
      </div>
    </Figure>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram D — handoff                                                 */
/* ------------------------------------------------------------------ */

export function HandoffDiagram() {
  return (
    <Figure
      label="Diagram D: multi-agent handoff within one run"
      caption={
        <>
          A handoff swaps the active agent inside the same run: one <Code>messages</Code> array, one turn counter, one
          trace. Each handoff increments a counter; when it exceeds <Code>maxHandoffs</Code> (default 5, taken from the
          starting agent or <Code>RunOptions</Code>) the run fails with a <Code>HandoffError</Code>.
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <Box tone="runtime" kicker="active agent" title="TriageAgent">
          <Code>handoffs: [BillingSpecialist, TechSpecialist]</Code> → model sees{' '}
          <Code>transfer_to_billingspecialist</Code>
        </Box>
        <Arrow responsive label="handoff #1" />
        <Box tone="runtime" kicker="active agent" title="BillingSpecialist">
          Own instructions, model and tools. Calls <Code>issue_refund</Code>.
        </Box>
        <Arrow responsive label="final text" />
        <Box tone="app" kicker="result" title="RunResult">
          <Code>agentName: &quot;BillingSpecialist&quot;</Code>
        </Box>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Box tone="store" kicker="shared run state" title="Context preserved">
          Every message so far (user input, triage tool call, handoff result) stays in the history the next agent sees.
        </Box>
        <Box tone="error" kicker="loop prevention" title="handoffCount > maxHandoffs → run_failed">
          Agents bouncing A → B → A … stop deterministically. The handoff also appears as a <Code>handoff</Code> event
          and a <Code>handoff</Code> trace span.
        </Box>
      </div>
    </Figure>
  );
}
