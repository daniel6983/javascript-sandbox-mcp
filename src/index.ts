#!/usr/bin/env node
import "ses";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

declare function lockdown(options?: {
  errorTaming?: "safe" | "unsafe";
  overrideTaming?: "moderate" | "severe";
  consoleTaming?: "safe" | "unsafe";
}): void;
declare const Compartment: any;
declare function harden<T>(obj: T): T;

lockdown();

const server = new McpServer({
  name: "run-javascript-sandbox",
  version: "1.0.0",
  description: "Run JavaScript code in a sandbox via SES (Secure ECMAScript)",
});

server.tool(
  "run-javascript",
  {
    code: z.string(),
  },
  async ({ code }: { code: string }) => {
    // we should keep all the logs locally then send them in the result.
    const logs: string[] = [];
    const console = {
      log: (...args: any[]) => {
        logs.push(args.map(String).join(" "));
      },
      error: (...args: any[]) => {
        logs.push(args.map(String).join(" "));
      },
      warn: (...args: any[]) => {
        logs.push(args.map(String).join(" "));
      },
      info: (...args: any[]) => {
        logs.push(args.map(String).join(" "));
      },
    };
    // Create the compartment with essential globals
    const compartment = new Compartment({
      globals: {
        Promise: harden(Promise),
        console: harden(console),
        // Add window and make it self-referential
        window: undefined, // Will be set after compartment creation
        self: undefined, // Will be set after compartment creation
        global: undefined, // Will be set after compartment creation
      },
      moduleMap: {},
      transforms: [],
    });
    // Make window, self, and global self-referential
    compartment.globalThis.window = compartment.globalThis;
    compartment.globalThis.self = compartment.globalThis;
    compartment.globalThis.global = compartment.globalThis;
    compartment.globalThis.console = console;
    const result = await compartment.evaluate(code);
    return {
      content: [{ type: "text", mimeType: "application/json", text: JSON.stringify({ logs, result }) }],
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  // 
});
