import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { createAlphaVantageMcpServer } from "./mcp/alphaVantageMcp";

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Create the Alpha Vantage MCP server
    const server = createAlphaVantageMcpServer();
    
    // Create a transport for stdio communication
    const transport = new StdioServerTransport();

    // Connect the server to the transport
    await server.connect(transport);
    console.error('Alpha Vantage Stock MCP Server running on stdio');
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

main();
