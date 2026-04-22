import ollama from 'ollama';

const response = await ollama.chat({
  model: 'gemma3:4b',
  stream: true,
  // think: 'low',
  messages: [
    {
      role: 'system',
      content: 'Can you give a response spanning exactly 5 rows in total? Don\'t acknowledge separately.'
    }
  ],
  keep_alive: "10m"
});

let out = '';
for await (const part of response) {
  out += part.message.content;
  if (part.message.content === '\n\n') {
    console.log(out.trim());
    out = '';
  }
}
console.log(out.trim());
