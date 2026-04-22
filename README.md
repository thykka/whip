# Ollama tools

Dead simple framework for creating custom tools for LLM Agents using TypeScript.

## Prerequisites

- Node.js (installation via [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) recommended) ([supported version](./.nvmrc))
- [Ollama](https://ollama.com/download)
- LLM model with tool call support, e.g. [gemma4:e4b](https://ollama.com/library/gemma4)
```sh
$ ollama install gemma4:e4b
```

## Installation
- Clone the repo, `cd` into the project root and install Node dependencies:
```sh
$ npm i
```
- Run the agent
```sh
$ npm start
```

## Creating your own tool functions

Copy one of the example tools [`hello`](./tools/hello.ts) and [`dir`](./tools/dir.ts) as a starting point.
Remember to import and add your tool to the `toolSpecs` object in [index.ts](./index.ts).

