import { normalize } from 'path';
import { readFileSync } from 'fs';
import { ToolSpec } from '../types/tools';

export type ReadFileParams = {
  filepath: string;
};

export function readFileFn({ filepath }: ReadFileParams): string {
  if (!filepath) return 'ERROR: `path` is required';
  try {
    const file = readFileSync(normalize(filepath ?? process.cwd()), { encoding: 'utf-8' });
    if (file.length > 4096) {
      return file.slice(0, 4000) + '\n\n(Output truncated)';
    }
    return file;
  } catch (error: any) {
    return 'ERROR: ' + error.toString();
  }
}

export const readFile: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'readFile',
      description: "Reads the given plain text file from user's local system",
      parameters: {
        type: 'object',
        properties: {
          filepath: {
            type: 'string',
            description: 'File path'
          }
        }
      }
    }
  },
  execute: args => readFileFn(args as ReadFileParams)
};

export default readFile;
