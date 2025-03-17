import { IntegrationError } from './types';
import type { RetryOptions } from './types';

/**
 * Implements an exponential backoff retry strategy with jitter
 * for resilient API calls and integration operations
 */
export class RetryStrategy {
  private maxAttempts: number;
  private baseDelay: number;
  private maxDelay: number;
  private factor: number;
  
  /**
   * Create a new retry strategy
   * @param options Configuration options for the retry strategy
   */
  constructor(options: RetryOptions = {}) {
    this.maxAttempts = options.maxAttempts ?? 5;
    this.baseDelay = options.baseDelay ?? 1000; // 1 second
    this.maxDelay = options.maxDelay ?? 60000; // 1 minute
    this.factor = options.factor ?? 2; // Exponential factor
  }
  
  /**
   * Execute a function with retries
   * @param fn The function to execute with retry capability
   * @returns The result of the function
   * @throws The last error encountered after all retry attempts fail
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry non-retryable integration errors
        if (error instanceof IntegrationError && !error.retryable) {
          throw error;
        }
        
        // Last attempt - give up and throw the error
        if (attempt === this.maxAttempts) {
          throw lastError;
        }
        
        // Calculate delay with exponential backoff and jitter
        const delay = Math.min(
          this.maxDelay,
          this.baseDelay * Math.pow(this.factor, attempt - 1)
        );
        
        // Add randomness (jitter) to prevent thundering herd
        const jitter = delay * 0.1 * Math.random();
        const finalDelay = delay + jitter;
        
        console.log(`Retry attempt ${attempt}/${this.maxAttempts} after ${finalDelay}ms`);
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, finalDelay));
      }
    }
    
    throw lastError ?? new Error('Retry failed');
  }
  
  /**
   * Create a function that will be retried according to this strategy
   * @param fn The function to make retryable
   * @returns A wrapped function that will retry on failure
   */
  retryable<T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>
  ): (...args: Args) => Promise<T> {
    return async (...args: Args): Promise<T> => {
      return this.execute(() => fn(...args));
    };
  }
}

/**
 * Create a new retry strategy with default settings
 */
export function createRetryStrategy(options?: RetryOptions): RetryStrategy {
  return new RetryStrategy(options);
}

/**
 * Default retry strategy instance
 */
export const defaultRetryStrategy = createRetryStrategy();

/**
 * Make a function retryable using the default retry strategy
 * @param fn Function to make retryable
 * @returns A wrapped function that will retry on failure
 */
export function withRetry<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<T> {
  return defaultRetryStrategy.retryable(fn);
}
