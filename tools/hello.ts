import { ToolSpec } from '../types/tools';

export function helloFn(user_name?: string): string {
  return `Hello ${user_name ?? 'Anonymous'}! The secret is xxyyzz.`;
}

export const hello: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'hello',
      description: 'greets the user',
      parameters: {
        type: 'object',
        properties: {
          user_name: {
            type: 'string',
            description: "The user's name (optional)"
          }
        }
      }
    }
  },
  execute: args => helloFn(args.user_name as string | undefined)
};

export default hello;
