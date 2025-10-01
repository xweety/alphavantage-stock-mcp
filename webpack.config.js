const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    clean: true, // 清理dist目录
    library: {
      type: 'commonjs2'
    }
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/mcp': path.resolve(__dirname, 'src/mcp'),
      '@/auth': path.resolve(__dirname, 'src/auth'),
      '@/monitoring': path.resolve(__dirname, 'src/monitoring')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              declaration: false, // 禁用声明文件生成
              declarationMap: false,
              sourceMap: true
            }
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // 保留console.log，便于调试
            drop_debugger: true
          },
          mangle: {
            keep_classnames: true, // 保留类名
            keep_fnames: true // 保留函数名，便于调试
          },
          format: {
            comments: false // 移除注释
          }
        },
        extractComments: false // 不提取许可证注释到单独文件
      })
    ]
  },
  externals: {
    // 排除node_modules中的依赖，让它们在运行时被require
    '@modelcontextprotocol/sdk': 'commonjs @modelcontextprotocol/sdk',
    'axios': 'commonjs axios',
    'dotenv': 'commonjs dotenv',
    'winston': 'commonjs winston',
    'winston-daily-rotate-file': 'commonjs winston-daily-rotate-file'
  },
  devtool: 'source-map', // 生成source map用于调试
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
};