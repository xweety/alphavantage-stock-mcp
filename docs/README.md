# Alpha Vantage Stock Data MCP Server

[![npm version](https://badge.fury.io/js/mcp-enterprise-server.svg)](https://badge.fury.io/js/mcp-enterprise-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript/Node.js implementation of the Model Context Protocol (MCP) server for accessing real-time and historical stock market data through the Alpha Vantage API. This server enables LLMs and agentic workflows to seamlessly interact with financial data.

## 🚀 Features

- **Real-time Stock Data**: Get current and historical stock prices (OHLCV) with intraday intervals
- **Daily Stock Data**: Access daily time series data with configurable output sizes
- **Stock Alerts**: Generate alerts based on price movement thresholds
- **Multiple Data Sources**: Support for various time intervals (1min, 5min, 15min, 30min, 60min, daily)
- **Error Handling**: Robust error handling and API response validation
- **TypeScript**: Full TypeScript support with type definitions
- **MCP Protocol**: Compatible with MCP-enabled applications like Claude Desktop, VS Code, and more

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Alpha Vantage API key (free tier available)

## 🔑 Getting an API Key

1. Sign up for a [Free Alpha Vantage API key](https://www.alphavantage.co/support/#api-key)
2. Copy your API key for configuration

## 📦 Installation

### Option 1: Using npm (Recommended)

```bash
npm install -g mcp-enterprise-server
```

### Option 2: From Source

```bash
git clone https://github.com/your-username/alphavantage-stock-data.git
cd alphavantage-stock-data
npm install
npm run build
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root or set environment variables:

```bash
ALPHAVANTAGE_API_KEY=your_api_key_here
```

## 🏃‍♂️ Running the Server

### Stdio Mode (Default)

This is the standard MCP server mode used for tools like Claude Desktop:

```bash
# If installed globally
mcp-enterprise-server

# From source
npm start

# Development mode
npm run dev
```

## 🔌 Integration with MCP Clients

### Claude Desktop

Add this json configuration:

```json
{
  "mcpServers": {
    "alphavantage-stock-data": {
      "command": "node",
        "type": "stdio",
      "args": ["/path/to/alphavantage-stock-data/dist/index.js"],
      "env": {
        "ALPHAVANTAGE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### VS Code with MCP Extension

If using an MCP extension in VS Code, configure the server path and environment variables according to the extension's documentation.

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

## 📊 Resources

### Stock Data Resource

Access stock data through the resource pattern:

**URI Template:** `stock://{symbol}/{interval}`

**Examples:**
- `stock://AAPL/daily` - Daily data for Apple
- `stock://GOOGL/5min` - 5-minute interval data for Google
- `stock://MSFT/1min` - 1-minute interval data for Microsoft

## 🔍 Example Queries

Here are some example queries you can use with the MCP server:

1. **Basic Stock Quote:**
   - "Get the current stock price for Apple (AAPL)"
   - "What's the latest closing price for Tesla?"

2. **Historical Data:**
   - "Show me the last 10 days of daily data for Microsoft"
   - "Get hourly data for Google stock today"

3. **Price Alerts:**
   - "Alert me if Amazon stock moves more than 3% in a day"
   - "Check for significant price movements in Netflix stock"

4. **Market Analysis:**
   - "Compare the performance of AAPL and GOOGL over the last week"
   - "Show me the trading volume patterns for Tesla"

## 🏗️ Development

### Building the Project

```bash
# TypeScript compilation
npm run build_tsc

# Webpack build
npm run build

# Development build
npm run build:dev
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## 📁 Project Structure

```
alphavantage-stock-data/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── mcp/
│   │   └── alphaVantageMcp.ts   # MCP server configuration
│   ├── services/
│   │   ├── alphaVantageService.ts # Alpha Vantage API integration
│   │   └── httpService.ts       # HTTP client service
│   └── utils/
│       └── logger.ts            # Logging utilities
├── dist/                        # Compiled JavaScript output
├── tests/                       # Test files
├── config/                      # Configuration files
├── docs/                        # Documentation
├── package.json                 # NPM package configuration
├── tsconfig.json               # TypeScript configuration
└── webpack.config.js           # Webpack configuration
```

## 🔒 Security & Best Practices

- **API Key Security**: Never commit your API key to version control
- **Environment Variables**: Use `.env` files for local development
- **Rate Limiting**: Be aware of Alpha Vantage API rate limits (5 API requests per minute, 500 per day for free tier)
- **Error Handling**: The server includes comprehensive error handling for API failures

## 📈 API Rate Limits

Alpha Vantage API limits (free tier):
- **5 API requests per minute**
- **500 API requests per day**

Consider upgrading to a premium plan for higher limits if needed.

## 🐛 Troubleshooting

### Common Issues

1. **"ALPHAVANTAGE_API_KEY is required" Error**
   - Ensure your API key is properly set in environment variables
   - Check that the `.env` file is in the correct location

2. **"API request failed" Error**
   - Verify your API key is valid
   - Check your internet connection
   - Ensure you haven't exceeded API rate limits

3. **"No time series data found" Error**
   - Verify the stock symbol is correct
   - Check if the market is open (for real-time data)
   - Try a different symbol or time interval

### Debug Mode

Run the server in development mode for detailed logging:

```bash
npm run dev
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for providing the stock market data API
- [Model Context Protocol](https://modelcontextprotocol.io/) for the protocol specification
- The TypeScript and Node.js communities for excellent tooling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/alphavantage-stock-data/issues)
- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **Alpha Vantage Support**: [support@alphavantage.co](mailto:support@alphavantage.co)

## 🔗 Related Projects

- [Official Alpha Vantage Python MCP Server](https://github.com/alphavantage/alpha_vantage_mcp)
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/desktop)

---

**Note**: This is an unofficial TypeScript/Node.js implementation. For the official Python implementation, visit the [Alpha Vantage MCP repository](https://github.com/alphavantage/alpha_vantage_mcp).