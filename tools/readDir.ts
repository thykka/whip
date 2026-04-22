import { normalize } from 'path';
import { readdirSync } from 'fs';
import { ToolSpec } from '../types/tools';

type ReadDirParams = {
  dirpath?: string;
};

export function readDirFn({ dirpath: path }: ReadDirParams): string {
  const entries = readdirSync(normalize(path ?? process.cwd()), { encoding: 'utf-8', withFileTypes: true });
  const sortedEntries = entries.sort((a, b) => {
    const aDir = a.isDirectory();
    const bDir = b.isDirectory();
    if ((aDir && bDir) || !(aDir || bDir)) {
      return a.name.localeCompare(b.name);
    }
    return aDir ? -1 : 1;
  });
  return sortedEntries.map(entry => entry.name + (entry.isDirectory() ? '/' : '')).join('\n');
}

export const readDir: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'readDir',
      description: "Lists directory entries from user's local system",
      parameters: {
        type: 'object',
        properties: {
          dirpath: {
            type: 'string',
            description: 'Path to directory (defaults to cwd)'
          }
        }
      }
    }
  },
  execute: args => readDirFn(args as ReadDirParams)
};

export default readDir;
