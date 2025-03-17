import { BaseAdapter } from './baseadapter';
import { RetryStrategy } from './retrylogic';
import type { SyncJobStatus, SyncOptions, SyncResult, ProgressCallback, CompletionCallback, ErrorCallback } from './types';

/**
 * Unique identifier for sync jobs
 */
let nextJobId = 1;

/**
 * Manages a background synchronization job between a service
 * and the local cache. Supports progress tracking, cancellation,
 * and event callbacks.
 */
export class SyncJob {
  private jobId: string;
  private adapter: BaseAdapter;
  private resourceType: string;
  private options: SyncOptions;
  private retryStrategy: RetryStrategy;
  private status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' = 'pending';
  private result?: SyncResult;
  private error?: Error;
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  private progressCallbacks: ProgressCallback[] = [];
  private completeCallbacks: CompletionCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private shouldCancel = false;
  
  /**
   * Create a new sync job
   * @param adapter The service adapter
   * @param resourceType Type of resource to synchronize
   * @param options Synchronization options
   */
  constructor(
    adapter: BaseAdapter, 
    resourceType: string, 
    options: SyncOptions = {}
  ) {
    this.jobId = this.generateJobId();
    this.adapter = adapter;
    this.resourceType = resourceType;
    this.options = {
      fullSync: false,
      batchSize: 100,
      priority: 'normal',
      ...options
    };
    this.retryStrategy = new RetryStrategy();
  }
  
  /**
   * Start the synchronization job
   * @returns A job result object
   */
  async start(): Promise<SyncResult> {
    if (this.status === 'running') {
      throw new Error('Job is already running');
    }
    
    if (this.shouldCancel) {
      throw new Error('Job was cancelled before starting');
    }
    
    this.status = 'running';
    this.startTime = new Date();
    this.shouldCancel = false;
    
    try {
      // Use retry strategy for resilient execution
      this.result = await this.retryStrategy.execute(async () => {
        // Check for cancellation
        if (this.shouldCancel) {
          throw new Error('Job was cancelled during execution');
        }
        
        // Execute the sync to cache operation
        const result = await this.adapter.syncToCache(
          this.resourceType, 
          this.options
        );
        
        return result;
      });
      
      this.status = 'completed';
      this.endTime = new Date();
      this.notifyComplete(this.result);
      
      return this.result;
    } catch (error) {
      this.status = 'failed';
      this.error = error as Error;
      this.endTime = new Date();
      this.notifyError(this.error);
      
      throw error;
    }
  }
  
  /**
   * Pause the job if it's running
   * Note: Implementation depends on the adapter supporting
   * pause functionality, which may vary by service
   */
  pause(): void {
    if (this.status !== 'running') {
      throw new Error('Cannot pause a job that is not running');
    }
    this.status = 'paused';
    // Implementation note: In a real system, we would need to communicate
    // with the adapter to pause ongoing network operations
  }
  
  /**
   * Resume a paused job
   */
  async resume(): Promise<SyncResult> {
    if (this.status !== 'paused') {
      throw new Error('Cannot resume a job that is not paused');
    }
    this.status = 'running';
    return this.start();
  }
  
  /**
   * Cancel the job
   */
  cancel(): void {
    this.shouldCancel = true;
    
    if (this.status === 'pending' || this.status === 'paused') {
      this.status = 'failed';
      this.error = new Error('Job was cancelled');
      this.notifyError(this.error);
    }
    
    // For running jobs, the cancellation will be handled during execution
  }
  
  /**
   * Get the current status of the job
   */
  getStatus(): SyncJobStatus {
    return {
      status: this.status,
      resourceType: this.resourceType,
      progress: this.result ? this.result.recordsProcessed : 0,
      errors: this.result ? this.result.errors : [],
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
  
  /**
   * Get the job ID
   */
  getJobId(): string {
    return this.jobId;
  }
  
  /**
   * Register a callback for progress updates
   * @param callback Function to call when progress updates
   */
  onProgress(callback: ProgressCallback): SyncJob {
    this.progressCallbacks.push(callback);
    return this;
  }
  
  /**
   * Register a callback for job completion
   * @param callback Function to call when job completes
   */
  onComplete(callback: CompletionCallback): SyncJob {
    this.completeCallbacks.push(callback);
    return this;
  }
  
  /**
   * Register a callback for job errors
   * @param callback Function to call when job errors
   */
  onError(callback: ErrorCallback): SyncJob {
    this.errorCallbacks.push(callback);
    return this;
  }
  
  /**
   * Notify all progress callbacks
   * @param progress Current progress value
   * @param total Total expected records
   */
  private notifyProgress(progress: number, total: number): void {
    this.progressCallbacks.forEach(callback => {
      try {
        callback(progress, total);
      } catch (e) {
        console.error('Error in progress callback:', e);
      }
    });
  }
  
  /**
   * Notify all completion callbacks
   * @param result Result of the sync operation
   */
  private notifyComplete(result: SyncResult): void {
    this.completeCallbacks.forEach(callback => {
      try {
        callback(result);
      } catch (e) {
        console.error('Error in completion callback:', e);
      }
    });
  }
  
  /**
   * Notify all error callbacks
   * @param error Error that occurred
   */
  private notifyError(error: Error): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });
  }
  
  /**
   * Generate a unique job ID
   */
  private generateJobId(): string {
    const id = nextJobId++;
    const timestamp = Date.now();
    return `sync-${this.adapter.getServiceName()}-${this.resourceType}-${timestamp}-${id}`;
  }
}

/**
 * Create a new synchronization job
 * @param adapter Service adapter
 * @param resourceType Type of resource to synchronize
 * @param options Synchronization options
 */
export function createSyncJob(
  adapter: BaseAdapter,
  resourceType: string,
  options?: SyncOptions
): SyncJob {
  return new SyncJob(adapter, resourceType, options);
}
