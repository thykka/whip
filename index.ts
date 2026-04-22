// https://github.com/ollama/ollama/blob/main/docs/api.md
import ollama, { Message, Tool } from 'ollama';

import type { ToolSpec } from './types/tools.js';

import { hello } from './tools/hello.js';
import { dir } from './tools/dir.js';
import { chef } from './tools/chef.js';
import { timeDate } from './tools/timedate.js';

const toolSpecs: Record<string, ToolSpec> = { hello, dir, chef, timeDate };
const tools: Tool[] = Object.values(toolSpecs).map(spec => spec.definition);

const DEBUG = false;

const Color = {
  reset: '\u001b[0m',
  cyan: '\u001b[36m',
  grey: '\u001b[90m'
};

const [nodePath, scriptPath, ...prompt] = process.argv;

async function agentLoop() {
  const messages: Message[] = [
    {
      role: 'system',
      content: 'NOTE: User cannot see tool results, assistant must always format and relay them.'
    },
    {
      role: 'user',
      content: prompt.join(' ') ?? '(blank message)'
    }
  ];

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
        top_k: 64
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
          process.stdout.write(`${Color.grey}> Thinking...\n`);
        }
        process.stdout.write(chunk.message.thinking);
        thinking += chunk.message.thinking;
      } else if (isThinking) {
        isThinking = false;
        const thinkTime = (performance.now() - startTime) / 1000;
        process.stdout.write(`\n> Thought for ${thinkTime.toFixed(2)}s\n${Color.reset}`);
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
        process.stdout.write(
          `${Color.cyan}> Tool<${name}(${JSON.stringify(call.function.arguments)})>: ${result}\n\n${Color.reset}`
        );
        messages.push({ role: 'tool', tool_name: name, content: result });
      } else {
        messages.push({
          role: 'tool',
          tool_name: name,
          content: 'Unknown tool'
        });
      }
    }
  }
  process.stdout.write('\n');
  if (DEBUG) console.log(messages);
}

agentLoop().catch(console.error);
