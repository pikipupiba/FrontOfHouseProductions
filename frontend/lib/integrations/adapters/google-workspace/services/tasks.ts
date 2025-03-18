import { tasks_v1, google } from 'googleapis';
import { FetchOptions, QueryOptions, SyncOptions, SyncResult } from '../../../core/types';
import { GoogleWorkspaceAdapter } from '..';

export class TasksService {
  private adapter: GoogleWorkspaceAdapter;
  private tasksApi: tasks_v1.Tasks | null = null;
  
  constructor(adapter: GoogleWorkspaceAdapter) {
    this.adapter = adapter;
  }
  
  /**
   * Get the Tasks API client
   */
  private getTasksApi(): tasks_v1.Tasks {
    if (!this.tasksApi) {
      const auth = this.adapter.getOAuth2Client();
      this.tasksApi = google.tasks({ version: 'v1', auth });
    }
    return this.tasksApi;
  }
  
  /**
   * Get a single task
   */
  async getTask(taskId: string, options?: FetchOptions & { taskListId?: string }): Promise<tasks_v1.Schema$Task> {
    const api = this.getTasksApi();
    
    // Require task list ID - there's no way to get a task without knowing its list
    const taskListId = options?.taskListId;
    if (!taskListId) {
      throw new Error('taskListId is required to get a task');
    }
    
    const response = await api.tasks.get({
      tasklist: taskListId,
      task: taskId
    });
    
    return response.data;
  }
  
  /**
   * Get a task list by ID
   */
  async getTaskList(taskListId: string, options?: FetchOptions): Promise<tasks_v1.Schema$TaskList> {
    const api = this.getTasksApi();
    
    const response = await api.tasklists.get({
      tasklist: taskListId
    });
    
    return response.data;
  }
  
  /**
   * List task lists
   */
  async listTaskLists(query: QueryOptions): Promise<tasks_v1.Schema$TaskList[]> {
    const api = this.getTasksApi();
    
    const params: tasks_v1.Params$Resource$Tasklists$List = {
      maxResults: query.limit || 100,
      pageToken: query.pageToken as string
    };
    
    const response = await api.tasklists.list(params);
    
    return response.data.items || [];
  }
  
  /**
   * List tasks in a task list
   */
  async listTasks(query: QueryOptions & { taskListId?: string }): Promise<tasks_v1.Schema$Task[]> {
    const api = this.getTasksApi();
    
    // Require task list ID
    const taskListId = query.taskListId;
    if (!taskListId) {
      throw new Error('taskListId is required to list tasks');
    }
    
    const params: tasks_v1.Params$Resource$Tasks$List = {
      tasklist: taskListId,
      maxResults: query.limit || 100,
      pageToken: query.pageToken as string,
      showCompleted: query.showCompleted !== false,
      showHidden: query.showHidden === true,
      showDeleted: query.showDeleted === true,
      updatedMin: query.updatedMin ? new Date(query.updatedMin).toISOString() : undefined,
      dueMin: query.dueMin ? new Date(query.dueMin).toISOString() : undefined,
      dueMax: query.dueMax ? new Date(query.dueMax).toISOString() : undefined
    };
    
    const response = await api.tasks.list(params);
    
    return response.data.items || [];
  }
  
  /**
   * Create a new task list
   */
  async createTaskList(data: { title: string }): Promise<tasks_v1.Schema$TaskList> {
    const api = this.getTasksApi();
    
    const response = await api.tasklists.insert({
      requestBody: {
        title: data.title
      }
    });
    
    return response.data;
  }
  
  /**
   * Create a new task
   */
  async createTask(data: { 
    title: string; 
    taskListId: string;
    notes?: string;
    due?: string | Date;
    status?: 'needsAction' | 'completed';
    completed?: string | Date;
    parent?: string;
    position?: string;
  }): Promise<tasks_v1.Schema$Task> {
    const api = this.getTasksApi();
    
    // Build task object
    const task: tasks_v1.Schema$Task = {
      title: data.title
    };
    
    if (data.notes) {
      task.notes = data.notes;
    }
    
    if (data.due) {
      task.due = typeof data.due === 'string' ? data.due : data.due.toISOString();
    }
    
    if (data.status) {
      task.status = data.status;
    }
    
    if (data.completed) {
      task.completed = typeof data.completed === 'string' ? data.completed : data.completed.toISOString();
    }
    
    if (data.parent) {
      task.parent = data.parent;
    }
    
    // Extract taskListId from data
    const { taskListId, ...taskData } = data;
    
    const response = await api.tasks.insert({
      tasklist: taskListId,
      requestBody: task
    });
    
    return response.data;
  }
  
  /**
   * Update a task
   */
  async updateTask(taskId: string, data: { 
    taskListId: string;
    title?: string;
    notes?: string;
    due?: string | Date;
    status?: 'needsAction' | 'completed';
    completed?: string | Date;
    parent?: string;
    position?: string;
  }): Promise<tasks_v1.Schema$Task> {
    const api = this.getTasksApi();
    
    // Build task object
    const task: tasks_v1.Schema$Task = {};
    
    if (data.title) {
      task.title = data.title;
    }
    
    if (data.notes !== undefined) {
      task.notes = data.notes;
    }
    
    if (data.due !== undefined) {
      task.due = data.due === null ? null : 
        (typeof data.due === 'string' ? data.due : data.due.toISOString());
    }
    
    if (data.status) {
      task.status = data.status;
    }
    
    if (data.completed !== undefined) {
      task.completed = data.completed === null ? null : 
        (typeof data.completed === 'string' ? data.completed : data.completed.toISOString());
    }
    
    if (data.parent !== undefined) {
      task.parent = data.parent;
    }
    
    if (data.position !== undefined) {
      task.position = data.position;
    }
    
    // Extract taskListId from data
    const { taskListId, ...taskData } = data;
    
    const response = await api.tasks.update({
      tasklist: taskListId,
      task: taskId,
      requestBody: task
    });
    
    return response.data;
  }
  
  /**
   * Update a task list
   */
  async updateTaskList(taskListId: string, data: { title: string }): Promise<tasks_v1.Schema$TaskList> {
    const api = this.getTasksApi();
    
    const response = await api.tasklists.update({
      tasklist: taskListId,
      requestBody: {
        title: data.title
      }
    });
    
    return response.data;
  }
  
  /**
   * Delete a task
   */
  async deleteTask(taskId: string, options: { taskListId: string }): Promise<void> {
    const api = this.getTasksApi();
    
    await api.tasks.delete({
      tasklist: options.taskListId,
      task: taskId
    });
  }
  
  /**
   * Delete a task list
   */
  async deleteTaskList(taskListId: string): Promise<void> {
    const api = this.getTasksApi();
    
    await api.tasklists.delete({
      tasklist: taskListId
    });
  }
  
  /**
   * Sync tasks to cache
   */
  async syncTasks(options?: SyncOptions): Promise<SyncResult> {
    const startTime = new Date();
    const api = this.getTasksApi();
    
    try {
      // In a real implementation, this would sync tasks to the database
      // This is a placeholder implementation
      console.log('Syncing Tasks to cache...');
      
      // Initialize counters for sync results
      let recordsProcessed = 0;
      let recordsFailed = 0;
      const errors: Error[] = [];
      
      // Default options
      const syncOptions = {
        fullSync: options?.fullSync || false,
        batchSize: options?.batchSize || 100,
        maxRecords: options?.maxRecords || 1000,
        ...options
      };
      
      // First, get all task lists
      const taskLists = await this.listTaskLists({ limit: 100 });
      
      // Calculate updated time
      const updatedMin = syncOptions.sinceDatetime?.toISOString();
      
      // For each task list, get tasks
      for (const taskList of taskLists) {
        if (!taskList.id) continue;
        
        try {
          // Build params for task list
          const params: tasks_v1.Params$Resource$Tasks$List = {
            tasklist: taskList.id,
            maxResults: syncOptions.batchSize,
            showCompleted: true,
            showHidden: true
          };
          
          if (updatedMin) {
            params.updatedMin = updatedMin;
          }
          
          // Get tasks for the task list
          const tasks = await this.listTasks({ 
            taskListId: taskList.id,
            limit: syncOptions.batchSize,
            updatedMin: updatedMin
          });
          
          // Process each task
          for (const task of tasks) {
            try {
              console.log(`Processing task ${task.id}: ${task.title}`);
              // Here we would upsert the task to the database
              recordsProcessed++;
            } catch (error) {
              console.error(`Failed to process task ${task.id}:`, error);
              recordsFailed++;
              errors.push(error as Error);
            }
            
            // Stop if we've reached the maximum number of records
            if (recordsProcessed + recordsFailed >= syncOptions.maxRecords) {
              break;
            }
          }
          
          // Stop if we've reached the maximum number of records
          if (recordsProcessed + recordsFailed >= syncOptions.maxRecords) {
            break;
          }
        } catch (error) {
          console.error(`Failed to process task list ${taskList.id}:`, error);
          errors.push(error as Error);
        }
      }
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      return {
        successful: errors.length === 0,
        resourceType: 'task',
        recordsProcessed,
        recordsFailed,
        errors,
        timestamp: endTime,
        duration,
        fullSync: syncOptions.fullSync
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      return {
        successful: false,
        resourceType: 'task',
        recordsProcessed: 0,
        recordsFailed: 1,
        errors: [error as Error],
        timestamp: endTime,
        duration,
        fullSync: options?.fullSync || false
      };
    }
  }
}
