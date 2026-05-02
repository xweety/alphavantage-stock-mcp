# Alpha Vantage Stock Data MCP Server

**README Languages:** [English](README.md) | [中文](README_zh.md)

[![NPM Version](https://img.shields.io/npm/v/alphavantage-stock-mcp)](https://www.npmjs.com/package/alphavantage-stock-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript/Node.js implementation of the Model Context Protocol (MCP) server for accessing historical stock market data through the Alpha Vantage API. This server enables LLMs and agentic workflows to seamlessly interact with financial data.

> **⚠️ Free Account Only**
> This MCP server is specifically designed for Alpha Vantage **free tier** accounts. It only uses API endpoints available under the free plan. Paid-tier endpoints are not supported.

## 🚀 Features

- **Free Tier Compatible**: Works entirely within the Alpha Vantage free account limits
- **Daily Stock Data**: Access daily time series data with configurable output sizes
- **TypeScript**: Full TypeScript support with type definitions
- **MCP Protocol**: Compatible with MCP-enabled applications like Claude Desktop, VS Code, and more

## 📋 Prerequisites

- Alpha Vantage **free** API key

## 🔑 Getting an API Key

1. Sign up for a [Free Alpha Vantage API key](https://www.alphavantage.co/support/#api-key)
2. Copy your API key for Integration with MCP Clients

## 🔌 Integration with MCP Clients

### MCP json Configuration

Add this json configuration:

```json
{
  "mcpServers": {
    "alphavantage-stock-data": {  
      "command": "npx",
      "args": [
        "alphavantage-stock-mcp"
      ],
      "env": {
        "ALPHAVANTAGE_API_KEY": "YOUR-ALPHA-VANTAGE-API-KEY"
      }
    }
  }
}
```

## 🛠️ Available Tools

### get-stock-data

Fetch stock data with a specified symbol and interval. Returns the latest 100 data points.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL", "GOOGL", "MSFT")
- `interval` (optional): Time interval - "daily", "weekly", "monthly" (default: "daily")

**Example Usage:**
```
Get the latest weekly data for Apple stock
Symbol: AAPL
Interval: weekly
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for providing the stock market data API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the protocol specification
