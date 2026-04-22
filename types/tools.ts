import { Tool as ToolDefinition } from 'ollama';

type ToolExecutor = (args?: Record<string, unknown>) => string | Promise<string>;

export type ToolSpec = {
  definition: ToolDefinition;
  execute: ToolExecutor;
};
