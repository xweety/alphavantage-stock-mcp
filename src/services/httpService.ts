import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { httpLogger as logger } from "../utils/logger";

export interface HttpError extends Error {
  status?: number;
  statusText?: string;
  response?: {
    data?: any;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  };
  config?: any;
}

/**
 * HTTP Service class providing RESTful API methods
 * Based on axios with retry logic and comprehensive error handling
 */
export class HttpService {
  private axiosInstance: AxiosInstance;
  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 1000000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for logging and error handling
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add start time for duration tracking
        // (config as any).startTime = Date.now();

        // logger.http(`→ ${config.method?.toUpperCase()} ${config.url}`, {
        //     url: config.url,
        //     method: config.method,
        //     headers: config.headers,
        //     params: config.params,
        // });
        return config;
      },
      (error) => {
        logger.error("HTTP Request Setup Error", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // const duration = (response.config as any).startTime
        //     ? Date.now() - (response.config as any).startTime
        //     : undefined;

        // logger.http(`← ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`, {
        //     status: response.status,
        //     statusText: response.statusText,
        //     url: response.config.url,
        //     duration: duration ? `${duration}ms` : undefined,
        // });
        return response;
      },
      (error) => {
        this.logError(error);
        return Promise.reject(this.transformError(error));
      },
    );
  }

  /**
   * Transform axios error to custom HttpError
   */
  private transformError(error: AxiosError): HttpError {
    const httpError = new Error(error.message) as HttpError;
    httpError.name = "HttpError";

    if (error.response) {
      httpError.status = error.response.status;
      httpError.statusText = error.response.statusText;
      httpError.response = {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>,
      };
    }

    httpError.config = error.config;
    return httpError;
  }

  /**
   * Log error details with enhanced formatting
   */
  private logError(error: AxiosError): void {
    const duration = (error.config as any)?.startTime
      ? Date.now() - (error.config as any).startTime
      : undefined;

    if (error.response) {
      logger.error(
        `HTTP ${error.response.status}: ${error.response.statusText}`,
        error,
        {
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          duration: duration ? `${duration}ms` : undefined,
          responseData: error.response.data,
        },
      );
    } else if (error.request) {
      logger.error("HTTP Request Failed: No response received", error, {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        timeout: error.config?.timeout,
        duration: duration ? `${duration}ms` : undefined,
      });
    } else {
      logger.error("HTTP Configuration Error", error, {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    }
  }

  /**
   * Execute HTTP request with retry logic
   */
  //   private async executeWithRetry<T>(
  //     requestConfig: AxiosRequestConfig,
  //     options: RequestOptions = {}
  //   ): Promise<HttpResponse<T>> {
  //     const maxRetries = options.retries ?? this.config.retries ?? 3;
  //     const retryDelay = options.retryDelay ?? this.config.retryDelay ?? 1000;

  //     let lastError: HttpError;

  //     for (let attempt = 0; attempt <= maxRetries; attempt++) {
  //       try {
  //         const response: AxiosResponse<T> = await this.axiosInstance.request(requestConfig);

  //         return {
  //           data: response.data,
  //           status: response.status,
  //           statusText: response.statusText,
  //           headers: response.headers as Record<string, string>,
  //         };
  //       } catch (error) {
  //         lastError = error as HttpError;

  //         // Don't retry on client errors (4xx) except 408, 429
  //         if (lastError.status && lastError.status >= 400 && lastError.status < 500) {
  //           if (lastError.status !== 408 && lastError.status !== 429) {
  //             throw lastError;
  //           }
  //         }

  //         if (attempt < maxRetries) {
  //           const delay = retryDelay * Math.pow(2, attempt);
  //           logger.warn(`HTTP request retry ${attempt + 1}/${maxRetries}`, {
  //             url: requestConfig.url,
  //             method: requestConfig.method?.toUpperCase(),
  //             status: lastError.status,
  //             attempt: attempt + 1,
  //             maxRetries,
  //             retryDelay: `${delay}ms`,
  //             reason: lastError.message,
  //           });

  //           await new Promise(resolve => setTimeout(resolve, delay));
  //         }
  //       }
  //     }

  //     throw lastError!;
  //   }

  /**
   * GET request
   * @param url - Request URL
   * @param options - Request options
   * @returns Promise<HttpResponse<T>>
   */
  async get<T>(url: string): Promise<AxiosResponse<T>> {
    return await this.axiosInstance.get<T>(url);
  }

  /**
   * POST request
   * @param url - Request URL
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise<HttpResponse<T>>
   */
  //   async post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<HttpResponse<T>> {
  //     const requestConfig = this.mergeRequestConfig(url, 'POST', data, options);
  //     return this.executeWithRetry<T>(requestConfig, options);
  //   }

  /**
   * Check if error is an Axios error
   * @param error - Error to check
   * @returns True if error is an AxiosError
   */
  static isAxiosError(error: any): error is AxiosError {
    return axios.isAxiosError(error);
  }

  /**
   * Create a new instance with different configuration
   * @param config - HTTP configuration
   * @returns New HttpService instance
   */
  static create(baseUrl: string): HttpService {
    return new HttpService(baseUrl);
  }
}

// Default HTTP service instance
// export const httpService = new HttpService();

// // Export individual methods for convenience
// export const {
//   get,
//   post,
//   put,
//   patchRequest,
//   deleteRequest,
// } = httpService;
