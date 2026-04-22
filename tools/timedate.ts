import { ToolSpec } from '../types/tools';

export function timeDateFn(locale: string): string {
  return new Intl.DateTimeFormat(locale ?? ['en-US'], {
    dateStyle: 'full',
    timeStyle: 'full',
    timeZone: 'Europe/Helsinki'
  }).format(new Date());
}

export const timeDate: ToolSpec = {
  definition: {
    type: 'function',
    function: {
      name: 'timeDate',
      description: 'Gets the current date & time',
      parameters: {
        type: 'object',
        properties: {
          locale: {
            type: 'string',
            description: 'Locale, optional, e.g. "fi-FI"'
          }
        }
      }
    }
  },
  execute: _ => timeDateFn(_.locale as string)
};

export default timeDate;
