// Self-check for the simulated demo script. Run: node lib/demo-script.check.mts
import assert from 'node:assert/strict';
import { simulate } from './demo-script.ts';

const kinds = (s: string) => simulate(s).map((x) => x.kind).join(',');

assert.equal(kinds('What is 125 * 8?'), 'user,model_tool,tool_result,model_text,done');
assert.deepEqual(simulate('What is 125 * 8?')[2], { kind: 'tool_result', tool: 'calculate', result: { expression: '125 * 8', result: 1000 } });
assert.deepEqual((simulate('7 / 0')[2] as { result: unknown }).result, { expression: '7 / 0', error: 'Invalid math expression' });
assert.deepEqual(simulate("What's the weather in Paris?")[1], { kind: 'model_tool', agent: 'Assistant', tool: 'get_weather', args: { city: 'Paris', unit: 'celsius' } });
assert.equal(kinds('I was charged twice on INV-9921, I want a refund.'), 'user,model_tool,handoff,model_tool,tool_result,model_text,done');
assert.equal(kinds('hello'), 'user,model_text,done');
console.log('demo-script ok');
