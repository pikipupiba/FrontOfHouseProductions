'use client';

import { useState, useEffect } from 'react';
import { GoogleWorkspaceAdapter } from '@/lib/mock/integrations/google-workspace-adapter';

interface Task {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  completed?: string;
  status: 'needsAction' | 'completed';
  position?: string;
  hidden: boolean;
  deleted: boolean;
  updated: string;
}

export function MockGoogleTasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskUpdating, setTaskUpdating] = useState<string | null>(null);

  // Function to load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // Create an instance of the GoogleWorkspaceAdapter
      const adapter = new GoogleWorkspaceAdapter();
      
      // Check if we're authenticated
      const authStatus = await adapter.checkAuthStatus();
      
      if (!authStatus.isAuthenticated) {
        setError('Not authenticated with Google Workspace');
        setLoading(false);
        return;
      }
      
      // Fetch tasks from the mock adapter
      const tasksList = await adapter.fetchResources<Task>('tasks', {
        sort: [{ field: 'status', direction: 'asc' }, { field: 'due', direction: 'asc' }]
      });
      
      // Filter out hidden and deleted tasks
      const filteredTasks = tasksList.filter(task => !task.hidden && !task.deleted);
      
      setTasks(filteredTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
      setLoading(false);
    }
  };
  
  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Toggle task completion status
  const toggleTaskStatus = async (taskId: string) => {
    try {
      setTaskUpdating(taskId);
      
      // Find the task
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // Create adapter instance
      const adapter = new GoogleWorkspaceAdapter();
      
      // Update the task status
      const newStatus = task.status === 'completed' ? 'needsAction' : 'completed';
      const updatedTask = await adapter.updateResource<Task>('tasks', taskId, {
        status: newStatus,
        completed: newStatus === 'completed' ? new Date().toISOString() : undefined
      });
      
      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      
      setTaskUpdating(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setTaskUpdating(null);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-4 border border-gray-200 rounded-lg animate-pulse">
            <div className="flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded-sm mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Refreshing the page or reconnecting your Google account may resolve this issue.
        </p>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">No tasks found in your Google Tasks.</p>
        <a 
          href="https://tasks.google.com/" 
          target="_blank"
          rel="noopener noreferrer" 
          className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
        >
          Create a task in Google Tasks →
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <button
                onClick={() => toggleTaskStatus(task.id)}
                disabled={taskUpdating === task.id}
                className={`h-5 w-5 rounded-sm border border-gray-400 flex items-center justify-center ${
                  taskUpdating === task.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'
                } ${
                  task.status === 'completed' ? 'bg-blue-500 border-blue-500' : 'bg-white'
                }`}
              >
                {task.status === 'completed' && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {taskUpdating === task.id && (
                  <div className="h-3 w-3 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin"></div>
                )}
              </button>
            </div>
            
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </p>
              
              {task.notes && (
                <p className={`mt-1 text-xs ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.notes}
                </p>
              )}
              
              {task.due && (
                <p className={`mt-1 text-xs ${
                  task.status === 'completed' 
                    ? 'text-gray-400' 
                    : new Date(task.due) < new Date() 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                }`}>
                  Due: {new Date(task.due).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="ml-4 flex-shrink-0">
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                task.status === 'completed' 
                  ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                  : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
              }`}>
                {task.status === 'completed' ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4 border-t border-gray-100">
        <a 
          href="https://tasks.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Manage Tasks in Google →
        </a>
      </div>
    </div>
  );
}
