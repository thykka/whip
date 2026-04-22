import { ToolSpec } from '../types/tools';

export function dirFn(): string {
  return process.cwd();
}

export const dir: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'dir',
      description: 'gives the current directory'
    }
  },
  execute: _ => dirFn()
};

export default dir;
