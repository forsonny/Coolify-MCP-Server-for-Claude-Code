#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const server = new Server(
  {
    name: 'coolify-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'test_version',
        description: 'Test getting Coolify version',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;
  
  if (name === 'test_version') {
    try {
      const response = await axios.get('https://coolify.sonnyvps.online/api/v1/version', {
        headers: {
          'Authorization': 'Bearer 1|WfzhCbOpJq6IyHcsnJiA5sVXtvDadPOrxGFYD2yE2b2c308e',
        },
      });
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);