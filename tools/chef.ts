import { ToolSpec } from '../types/tools';

const chefAnswers = ['🧑‍🍳', '🍳', '🍔'];

export function chefFn(question: string): string {
  return chefAnswers[Math.floor(Math.random() * chefAnswers.length)];
}

export const chef: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'chef',
      description: 'Ask the chef anything',
      parameters: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: 'The question for the chef'
          }
        }
      }
    }
  },
  execute: args => chefFn(args.question as string)
};

export default chef;
