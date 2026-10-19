'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Bot, Cpu, RotateCcw, Send, Shuffle, Wrench } from 'lucide-react';
import { cn } from '@/lib/cn';
import { simulate, type Step } from '@/lib/demo-script';

const examples = ['What is 125 * 8?', "What's the weather in Paris?", 'I was charged twice on INV-9921, I want a refund.'];

function StepRow({ step }: { step: Step }) {
  switch (step.kind) {
    case 'user':
      return (
        <Row icon={<Send className="size-3.5" />} lane="your app" tone="app" event="agent.run(input)">
          <p>{step.text}</p>
        </Row>
      );
    case 'model_tool':
      return (
        <Row icon={<Bot className="size-3.5" />} lane={`model · ${step.agent}`} tone="model" event="tool call requested">
          <p className="font-mono text-[12.5px]">
            <span className="text-sagu-green">{step.tool}</span>
            <span className="text-fd-muted-foreground">(</span>
            {JSON.stringify(step.args)}
            <span className="text-fd-muted-foreground">)</span>
          </p>
        </Row>
      );
    case 'tool_result':
      return (
        <Row icon={<Wrench className="size-3.5" />} lane="runtime · tool execution" tone="tool" event="tool_start → tool_end">
          <p className="mb-1 text-[12px] text-fd-muted-foreground">
            Validated args with Zod, ran <code className="font-mono">{step.tool}.execute()</code>, appended a tool message:
          </p>
          <pre className="overflow-x-auto rounded-md bg-fd-muted px-2.5 py-1.5 font-mono text-[12px]">
            {JSON.stringify(step.result)}
          </pre>
        </Row>
      );
    case 'handoff':
      return (
        <Row icon={<Shuffle className="size-3.5" />} lane="runtime · handoff" tone="runtime" event="handoff">
          <p>
            Active agent switched <b className="font-medium">{step.from}</b> → <b className="font-medium">{step.to}</b>. Message
            history is kept; handoff count 1 of maxHandoffs 5.
          </p>
        </Row>
      );
    case 'model_text':
      return (
        <Row icon={<Bot className="size-3.5" />} lane={`model · ${step.agent}`} tone="model" event="text_delta (final answer)">
          <p>{step.text}</p>
        </Row>
      );
    case 'done':
      return (
        <Row icon={<Cpu className="size-3.5" />} lane="runtime → your app" tone="app" event="run_completed">
          <p className="font-mono text-[12.5px]">
            {`{ success: true, agentName: "${step.agent}", turns: ${step.turns} }`}
          </p>
        </Row>
      );
  }
}

const rowTone = {
  app: 'border-sagu-blue/40 text-sagu-blue',
  model: 'border-fd-border text-fd-muted-foreground',
  tool: 'border-sagu-green/40 text-sagu-green',
  runtime: 'border-sagu-accent/45 text-sagu-accent',
} as const;

function Row({
  icon,
  lane,
  tone,
  event,
  children,
}: {
  icon: ReactNode;
  lane: string;
  tone: keyof typeof rowTone;
  event: string;
  children: ReactNode;
}) {
  return (
    <li className="relative grid grid-cols-[28px_1fr] gap-3 pb-4 last:pb-0 motion-safe:animate-[fadeIn_.25s_ease-out]">
      <span className={cn('z-10 grid size-7 place-items-center rounded-full border bg-fd-background', rowTone[tone])}>
        {icon}
      </span>
      <div className="min-w-0 rounded-lg border border-fd-border bg-fd-card px-3.5 py-2.5 text-sm">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className={cn('font-mono text-[10.5px] uppercase tracking-wider', rowTone[tone])}>{lane}</span>
          <span className="font-mono text-[10.5px] text-fd-muted-foreground">{event}</span>
        </div>
        <div className="break-words text-fd-foreground">{children}</div>
      </div>
    </li>
  );
}

export function AgentDemo() {
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [visible, setVisible] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => stop, []);

  function run(text: string) {
    if (!text.trim()) return;
    stop();
    const next = simulate(text);
    setSteps(next);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(next.length);
      return;
    }
    setVisible(1);
    timer.current = setInterval(() => {
      setVisible((v) => {
        if (v + 1 >= next.length) stop();
        return Math.min(v + 1, next.length);
      });
    }, 650);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(input);
  }

  function reset() {
    stop();
    setSteps([]);
    setVisible(0);
    setInput('');
  }

  const running = visible > 0 && visible < steps.length;

  return (
    <div className="rounded-xl border border-fd-border bg-fd-card/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fd-border px-4 py-2.5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-fd-muted-foreground">
          simulated agent loop · no model, no API keys
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Reset
        </button>
      </div>

      <div className="p-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <label htmlFor="demo-input" className="sr-only">
            Message for the simulated agent
          </label>
          <input
            id="demo-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something…"
            maxLength={200}
            className="min-w-0 flex-1 rounded-md border border-fd-border bg-fd-background px-3 py-2 text-sm placeholder:text-fd-muted-foreground focus-visible:outline-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || running}
            className="inline-flex items-center gap-1.5 rounded-md bg-fd-primary px-3 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity disabled:opacity-40"
          >
            Run
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2" aria-label="Example prompts">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={running}
              onClick={() => {
                setInput(ex);
                run(ex);
              }}
              className="rounded-full border border-fd-border px-3 py-1 text-xs text-fd-muted-foreground transition-colors hover:border-sagu-accent/60 hover:text-fd-foreground disabled:opacity-40"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="mt-5" aria-live="polite">
          {steps.length === 0 ? (
            <p className="rounded-lg border border-dashed border-fd-border px-4 py-8 text-center text-sm text-fd-muted-foreground">
              Pick an example or type a message to watch the event timeline.
            </p>
          ) : (
            <ol className="relative before:absolute before:bottom-3 before:left-[13.5px] before:top-3 before:w-px before:bg-fd-border">
              {steps.slice(0, visible).map((s, i) => (
                <StepRow key={i} step={s} />
              ))}
            </ol>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-fd-border pt-3 text-[11.5px] text-fd-muted-foreground">
          <span>
            <span className="text-fd-foreground">Model</span> decides what to do
          </span>
          <span>
            <span className="text-sagu-green">Runtime</span> validates and executes tools
          </span>
          <span>
            <span className="text-sagu-blue">Your app</span> sends input and receives the result
          </span>
        </div>
      </div>
    </div>
  );
}
