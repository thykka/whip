import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { ToolSpec } from './types/tools';

const toolDirectory = path.join(process.cwd(), './tools');
const toolFiles = fs.readdirSync(toolDirectory).filter(file => file.endsWith('.ts'));

export async function loadTools(): Promise<Map<string, ToolSpec>> {
  const tools = new Map<string, ToolSpec>();

  for (const file of toolFiles) {
    const modulePath = path.join(toolDirectory, file);

    try {
      const module = await import(pathToFileURL(modulePath).toString());
      const tool = module.default;

      if (tool?.definition?.function) {
        const { name } = tool.definition.function;
        tools.set(name, tool);
      } else {
        console.warn(`Invalid tool definition: ${file}`);
      }
    } catch (error) {
      console.error(`Failed loading tool from ${file};`, error);
    }
  }
  return tools;
}
