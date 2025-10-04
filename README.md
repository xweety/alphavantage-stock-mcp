# Alpha Vantage Stock Data MCP Server

[![npm version](https://badge.fury.io/js/mcp-enterprise-server.svg)](https://badge.fury.io/js/mcp-enterprise-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript/Node.js implementation of the Model Context Protocol (MCP) server for accessing real-time and historical stock market data through the Alpha Vantage API. This server enables LLMs and agentic workflows to seamlessly interact with financial data.

## 🚀 Features

- **Daily Stock Data**: Access daily time series data with configurable output sizes
- **TypeScript**: Full TypeScript support with type definitions
- **MCP Protocol**: Compatible with MCP-enabled applications like Claude Desktop, VS Code, and more

## 📋 Prerequisites

- Alpha Vantage API key (free tier available)

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

### 1. get-stock-data

Get intraday stock data with various time intervals.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL", "GOOGL", "MSFT")
- `interval` (optional): Time interval - "1min", "5min", "15min", "30min", "60min" (default: "5min")
- `outputsize` (optional): "compact" (latest 100 data points) or "full" (up to 20 years) (default: "compact")

**Example Usage:**
```
Get the latest 5-minute interval data for Apple stock
Symbol: AAPL
Interval: 5min
Output size: compact
```

### 2. get-daily-stock-data

Get daily stock data for a specific symbol.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL", "GOOGL", "MSFT")
- `outputsize` (optional): "compact" (latest 100 data points) or "full" (up to 20 years) (default: "compact")

**Example Usage:**
```
Get daily stock data for Tesla
Symbol: TSLA
Output size: full
```

### 3. get-stock-alerts

Generate alerts based on price movement thresholds.

**Parameters:**
- `symbol` (required): Stock symbol (e.g., "AAPL", "GOOGL", "MSFT")
- `threshold` (optional): Percentage threshold for price movement alerts (default: 5)

**Example Usage:**
```
Get price movement alerts for Microsoft with 3% threshold
Symbol: MSFT
Threshold: 3
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Run linting and tests before submitting

## 🙏 Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for providing the stock market data API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the protocol specification
