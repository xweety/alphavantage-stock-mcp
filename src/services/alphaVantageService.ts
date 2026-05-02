import dotenv from "dotenv";
import { HttpService } from "./httpService";

dotenv.config();
const BASE_URL = "https://www.alphavantage.co/query";
const accessKey = process.env.ALPHAVANTAGE_API_KEY;
if (!accessKey) {
  throw new Error("ALPHAVANTAGE_API_KEY is required");
}

const httpService = HttpService.create(BASE_URL);

/**
 * Fetches stock data from Alpha Vantage API
 * @param symbol Stock symbol (e.g., IBM, AAPL)
 * @param interval Time interval between data points for 'daily', 'weekly', or 'monthly' data
 * @returns Formatted stock data as a string
 */
export async function getStockData(
  symbol: string,
  interval: "daily" | "weekly" | "monthly",
): Promise<string> {
  try {
    let url: string;
    let timeSeriesKey: string;
    const normalizedInterval = interval.toLowerCase() as "daily" | "weekly" | "monthly";
    switch (normalizedInterval) {
      case "daily":
        url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${accessKey}`;
        timeSeriesKey = "Time Series (Daily)";
        break;
      case "weekly":
        url = `${BASE_URL}?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${accessKey}`;
        timeSeriesKey = "Weekly Time Series";
        break;
      case "monthly":
        url = `${BASE_URL}?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${accessKey}`;
        timeSeriesKey = "Monthly Time Series";
        break;
      default:
        url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${accessKey}`;
        timeSeriesKey = "Time Series (Daily)";
        break;
    }

    const response = await httpService.get<any>(url);

    // Check for error messages from Alpha Vantage
    if (response.data["Error Message"]) {
      throw new Error(response.data["Error Message"]);
    }

    if (response.data["Note"]) {
      console.warn("API Usage Note:", response.data["Note"]);
    }

    // Extract the time series data
    const timeSeries = response.data[timeSeriesKey];

    if (!timeSeries) {
      throw new Error("No time series data found in the response");
    }

    // Format the data
    const formattedData = formatTimeSeriesData(
      timeSeries,
      symbol,
      normalizedInterval,
    );
    return formattedData;
  } catch (error: any) {
    if (HttpService.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Formats time series data into a readable string
 */
function formatTimeSeriesData(
  timeSeries: any,
  symbol: string,
  interval: "daily" | "weekly" | "monthly",
): string {
  const dates = Object.keys(timeSeries).sort().reverse(); // Most recent first

  let result = `Stock data for ${symbol.toUpperCase()} (${interval} intervals):\n\n`;

  for (const date of dates) {
    const data = timeSeries[date];
    result += `${date}:\n`;
    result += `  Open: ${data["1. open"]}\n`;
    result += `  High: ${data["2. high"]}\n`;
    result += `  Low: ${data["3. low"]}\n`;
    result += `  Close: ${data["4. close"]}\n`;
    result += `  Volume: ${data["5. volume"]}\n\n`;
  }
  return result;
}