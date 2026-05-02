import {
  McpServer,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getStockData } from "../services/alphaVantageService";

/**
 * Creates and configures the Alpha Vantage MCP Server with all resources and tools
 */
export function createAlphaVantageMcpServer(): McpServer {
  // Create an MCP server
  const server = new McpServer({
    name: "alpha-vantage-stock-data",
    version: "1.0.0",
  });

  // Add a tool to get stock data
  server.tool(
    "get-stock-data",
    "Fetch stock data with specified symbol and interval (daily, weekly, monthly). Only return latest 100 data points",
    {
      symbol: z.string().describe("Stock symbol (e.g., IBM, AAPL)"),
      interval: z
        .enum(["daily", "weekly", "monthly"])
        .optional()
        .describe("Time interval between data points by daily or weekly or monthly (default: daily)")
    },
    async ({ symbol, interval = "daily" }) => {
      try {
        const data = await getStockData(symbol, interval);
        return {
          content: [{ type: "text", text: data }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching stock data: ${error instanceof Error ? error.message : String(error)
                }`,
            },
          ],
          isError: true,
        };
      }
    },
  );
  return server;
}
