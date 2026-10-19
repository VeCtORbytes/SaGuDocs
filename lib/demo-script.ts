/**
 * Educational simulation of the SAGU agent loop.
 * Nothing here calls a model or runs SAGU: every step is scripted locally from the input text.
 */

export type Step =
  | { kind: 'user'; text: string }
  | { kind: 'model_tool'; agent: string; tool: string; args: Record<string, unknown> }
  | { kind: 'tool_result'; tool: string; result: unknown }
  | { kind: 'handoff'; from: string; to: string; reason: string }
  | { kind: 'model_text'; agent: string; text: string }
  | { kind: 'done'; agent: string; turns: number };

const AGENT = 'Assistant';

export function simulate(input: string): Step[] {
  const text = input.trim();
  const lower = text.toLowerCase();
  const steps: Step[] = [{ kind: 'user', text }];

  const math = text.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/x×])\s*(-?\d+(?:\.\d+)?)/);
  if (math) {
    const a = Number(math[1]);
    const b = Number(math[3]);
    const op = math[2] === 'x' || math[2] === '×' ? '*' : math[2]!;
    const value = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : b === 0 ? NaN : a / b;
    const expression = `${a} ${op} ${b}`;
    steps.push(
      { kind: 'model_tool', agent: AGENT, tool: 'calculate', args: { expression } },
      {
        kind: 'tool_result',
        tool: 'calculate',
        result: Number.isFinite(value) ? { expression, result: value } : { expression, error: 'Invalid math expression' },
      },
      {
        kind: 'model_text',
        agent: AGENT,
        text: Number.isFinite(value)
          ? `${expression} equals ${value.toLocaleString('en-US')}.`
          : `I couldn't evaluate ${expression}.`,
      },
      { kind: 'done', agent: AGENT, turns: 2 },
    );
    return steps;
  }

  if (lower.includes('weather')) {
    const city = text.match(/\bin\s+([A-Za-z][A-Za-z .'-]*?)(?:[?.!,]|$)/)?.[1]?.trim() ?? 'London';
    steps.push(
      { kind: 'model_tool', agent: AGENT, tool: 'get_weather', args: { city, unit: 'celsius' } },
      {
        kind: 'tool_result',
        tool: 'get_weather',
        result: { city, temperature: 21, unit: 'celsius', condition: 'Partly Cloudy', humidity: 55 },
      },
      { kind: 'model_text', agent: AGENT, text: `It's 21°C and partly cloudy in ${city}, with 55% humidity.` },
      { kind: 'done', agent: AGENT, turns: 2 },
    );
    return steps;
  }

  if (lower.includes('refund') || lower.includes('charged')) {
    const invoiceId = text.match(/INV-\d+/i)?.[0]?.toUpperCase() ?? 'INV-9921';
    steps.push(
      {
        kind: 'model_tool',
        agent: 'TriageAgent',
        tool: 'transfer_to_billingspecialist',
        args: { reason: `Customer requested a refund for invoice ${invoiceId}` },
      },
      { kind: 'handoff', from: 'TriageAgent', to: 'BillingSpecialist', reason: 'refund request' },
      {
        kind: 'model_tool',
        agent: 'BillingSpecialist',
        tool: 'issue_refund',
        args: { invoiceId, amount: 79.99, reason: 'Accidental renewal charge' },
      },
      { kind: 'tool_result', tool: 'issue_refund', result: { status: 'APPROVED', refundId: 'ref_884920', invoiceId } },
      {
        kind: 'model_text',
        agent: 'BillingSpecialist',
        text: `I've processed your refund of $79.99 for invoice ${invoiceId}. Expect the credit in 3–5 business days.`,
      },
      { kind: 'done', agent: 'BillingSpecialist', turns: 3 },
    );
    return steps;
  }

  steps.push(
    {
      kind: 'model_text',
      agent: AGENT,
      text: "No tool is needed for that, so the model answers directly. Try a math, weather, or refund question to see tool calls.",
    },
    { kind: 'done', agent: AGENT, turns: 1 },
  );
  return steps;
}
