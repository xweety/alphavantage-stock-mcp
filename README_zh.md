# Alpha Vantage 股票数据 MCP 服务器

[![NPM Version](https://img.shields.io/npm/v/alphavantage-stock-mcp)](https://www.npmjs.com/package/alphavantage-stock-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 TypeScript/Node.js 实现的模型上下文协议 (MCP) 服务器，通过 Alpha Vantage API 访问历史股票市场数据。该服务器使 LLM 和智能体工作流能够无缝地与金融数据交互。

> **⚠️ 仅适用于免费账户**
> 本 MCP 服务器专为 Alpha Vantage **免费版**账户设计，仅使用免费套餐可用的 API 接口，不支持付费套餐专属接口。

## 🚀 功能特性

- **免费版兼容**：完全在 Alpha Vantage 免费账户限制内运行
- **每日股票数据**：访问每日时间序列数据，支持可配置的输出大小
- **TypeScript**：完整的 TypeScript 支持和类型定义
- **MCP 协议**：兼容支持 MCP 的应用程序，如 Claude Desktop、VS Code 等

## 📋 前置要求

- Alpha Vantage **免费版** API 密钥

## 🔑 获取 API 密钥

1. 注册获取 [免费 Alpha Vantage API 密钥](https://www.alphavantage.co/support/#api-key)
2. 复制您的 API 密钥以便与 MCP 客户端集成

## 🔌 与 MCP 客户端集成

### MCP JSON 配置

添加以下 JSON 配置：

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

## 🛠️ 可用工具

### get-stock-data

获取指定股票代码和时间间隔的股票数据，返回最新 100 个数据点。

**参数：**
- `symbol`（必需）：股票代码（例如："AAPL"、"GOOGL"、"MSFT"）
- `interval`（可选）：时间间隔 - "daily"、"weekly"、"monthly"（默认："daily"）

**使用示例：**
```
获取苹果股票的最新周线数据
股票代码：AAPL
间隔：weekly
```

## 🤝 贡献

我们欢迎贡献！请遵循以下步骤：

1. Fork 该仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交您的更改（`git commit -m 'Add some amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启 Pull Request

## 🙏 致谢

- [Alpha Vantage](https://www.alphavantage.co/) 提供股票市场数据 API
- [模型上下文协议](https://modelcontextprotocol.io/) 提供协议规范