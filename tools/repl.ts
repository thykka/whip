import { runInNewContext } from 'vm';

import { ToolSpec } from '../types/tools';

export function replFn(expression?: string): string {
  if (!expression) return 'ERROR: no expression provided';
  try {
    const result = runInNewContext(expression, undefined, {
      timeout: 200, // ms
      breakOnSigint: true,
      contextCodeGeneration: {
        strings: false,
        wasm: false
      }
    });
    // const result = eval(expression);
    return result.toString();
  } catch (error: any) {
    return `ERROR: ${error.toString()}`;
  }
}

export const repl: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'repl',
      description: 'runs a javascript expression and returns the result',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'the expression to evaluate'
          }
        }
      }
    }
  },
  execute: args => replFn(args?.expression as string | undefined)
};

export default repl;
