
import { shouldRetry } from './errorUtils';

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts, delay, backoffMultiplier, maxDelay } = { ...defaultOptions, ...options };
  
  let lastError: Error;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      
      if (!shouldRetry(error)) {
        throw error;
      }
      
     
      if (attempt === maxAttempts) {
        throw error;
      }
      
     
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      
      currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
    }
  }
  
  throw lastError!;
}

export function createRetryableFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: RetryOptions
) {
  return async (...args: T): Promise<R> => {
    return withRetry(() => fn(...args), options);
  };
}
