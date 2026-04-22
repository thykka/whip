// https://github.com/ollama/ollama/blob/main/docs/api.md
import ollama, { Message, Tool } from 'ollama';

import type { ToolSpec } from './types/tools.js';

import { hello } from './tools/hello.js';
import { dir } from './tools/dir.js';
import { chef } from './tools/chef.js';


const toolSpecs: Record<string, ToolSpec> = { hello, dir, chef };
const tools: Tool[] = Object.values(toolSpecs).map(spec => spec.definition);

const DEBUG = false;

async function agentLoop() {
  const messages: Message[] = [{
    role: 'system',
    content: 'NOTE: User cannot see tool results, assistant must always format and relay them.'
  },{
    role: 'user',
    content: 'Can you ask the chef for today\'s recommendation?'
  }];

  while (true) {
    const startTime = performance.now();
    const stream = await ollama.chat({
      model: 'gemma4:e4b',
      messages,
      tools,
      think: 'low',
      stream: true,
      options: {
        temperature: 1.0,
        top_p: 0.95,
        top_k: 64,
      },
      keep_alive: '5m'
    });

    let isThinking = false;
    let content = '';
    let thinking = '';
    const toolCalls = [];

    for await (const chunk of stream) {
      if (chunk.message.thinking) {
        if (!isThinking) {
          isThinking = true;
          process.stdout.write(`> Thinking...\n`);
        }
        process.stdout.write(chunk.message.thinking);
        thinking += chunk.message.thinking;
      } else if (isThinking) {
        isThinking = false;
        const thinkTime = (performance.now() - startTime) / 1000;
        process.stdout.write(`\n> Thought for ${ thinkTime.toFixed(2) }s\n`);
      }
      if (chunk.message.content) {
        process.stdout.write(chunk.message.content);
        content += chunk.message.content;
      } else if (!isThinking) {
        process.stdout.write('\n');
      }
      if (chunk.message.tool_calls?.length) {
        toolCalls.push(...chunk.message.tool_calls);
      }
    }

    if (thinking || content || toolCalls.length) {
      messages.push({
        role: 'assistant',
        thinking,
        content,
        tool_calls: toolCalls
      });
    }

    if (!toolCalls.length) break;

    for (const call of toolCalls) {
      const { name } = call.function;
      if (name in toolSpecs) {
        const spec = toolSpecs[name as keyof typeof toolSpecs];
        const result = spec.execute(call.function.arguments ?? {});
        process.stdout.write(`> Tool<${name}(${JSON.stringify(call.function.arguments)})>: ${result}\n`);
        messages.push({ role: 'tool', tool_name: name, content: result });
      } else {
        messages.push({ role: 'tool', tool_name: name, content: 'Unknown tool' });
      }
    }
  }
  if (DEBUG) console.log(messages);
}


agentLoop().catch(console.error);