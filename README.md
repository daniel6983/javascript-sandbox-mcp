# JavaScript Sandbox MCP Server

A Model Context Protocol (MCP) server that executes JavaScript code securely in a sandboxed environment using [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses).

https://github.com/user-attachments/assets/654f71e7-fb88-41ca-a6d0-634cc07fe426

## Features

### Tools

- `run_javascript` - Execute arbitrary JavaScript code in a secure SES compartment
  - Accepts a string of JavaScript code
  - Returns the result and all console logs as JSON-formatted text

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Usage

You can run the server directly:

```bash
npm start
```

Or use the built binary:

```bash
node build/index.js
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "run-javascript-sandbox": {
      "command": "npx",
      "args": ["-y", "javascript-sandbox-mcp"]
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

---

**Security Note:**

This server uses SES to sandbox code execution, but running untrusted code always carries risk. Use with caution and only in trusted environments. 
