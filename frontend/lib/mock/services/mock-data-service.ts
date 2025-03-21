/**
 * Mock Data Service
 * 
 * This service provides a mock implementation of CRUD operations for any data type.
 * It simulates network latency and database operations using in-memory data.
 */

// Generic type for any entity with an ID
export interface Entity {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Generic mock data service class
 * Provides CRUD operations on a collection of entities
 */
export class MockDataService<T extends Entity> {
  private data: T[];
  private entityName: string;
  private delayMs: number;
  
  /**
   * Create a new mock data service
   * @param initialData Initial data array
   * @param entityName Name of the entity (for error messages)
   * @param delayMs Simulated network delay in milliseconds
   */
  constructor(initialData: T[], entityName: string, delayMs = 300) {
    this.data = [...initialData]; // Clone to avoid mutations
    this.entityName = entityName;
    this.delayMs = delayMs;
  }
  
  /**
   * Simulate network delay
   */
  private async delay(customDelay?: number): Promise<void> {
    const delayTime = customDelay ?? this.delayMs;
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }
  
  /**
   * Get all items with optional filtering
   * @param filters Optional filter object where keys are entity properties and values are expected values
   * @param sortBy Optional property name to sort by
   * @param sortDirection Optional sort direction ('asc' or 'desc')
   * @param page Optional page number for pagination
   * @param pageSize Optional page size for pagination
   */
  async getAll(options: {
    filters?: Record<string, any>;
    sortBy?: keyof T;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ data: T[]; total: number; page?: number; totalPages?: number }> {
    await this.delay();
    
    const { filters, sortBy, sortDirection = 'asc', page, pageSize } = options;
    
    // Apply filters if provided
    let filteredData = this.data;
    if (filters) {
      filteredData = this.data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          // Handle array values (OR logic)
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          
          // Handle string contains for text fields
          if (typeof item[key] === 'string' && typeof value === 'string') {
            return item[key].toLowerCase().includes(value.toLowerCase());
          }
          
          // Exact match for other types
          return item[key] === value;
        });
      });
    }
    
    // Apply sorting if provided
    if (sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        // Handle string sorting
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle number or date sorting
        return sortDirection === 'asc'
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
    }
    
    // Apply pagination if provided
    if (page !== undefined && pageSize !== undefined) {
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
      const totalPages = Math.ceil(filteredData.length / pageSize);
      
      return {
        data: paginatedData,
        total: filteredData.length,
        page,
        totalPages
      };
    }
    
    return {
      data: filteredData,
      total: filteredData.length
    };
  }
  
  /**
   * Get a single item by ID
   * @param id Item ID
   */
  async getById(id: string): Promise<T> {
    await this.delay();
    
    const item = this.data.find(item => item.id === id);
    
    if (!item) {
      throw new Error(`${this.entityName} with ID ${id} not found`);
    }
    
    return { ...item }; // Return a copy to prevent mutations
  }
  
  /**
   * Create a new item
   * @param data Item data (without ID)
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    await this.delay(500); // Longer delay for create operations
    
    // Generate a random ID if not provided
    const id = `${this.entityName.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const createdAt = new Date().toISOString();
    
    // Use type assertion with unknown as intermediate step
    const newItem = { 
      ...data, 
      id, 
      created_at: createdAt 
    } as unknown as T;
    
    // Add to data array
    this.data.push(newItem);
    
    return { ...newItem }; // Return a copy
  }
  
  /**
   * Update an existing item
   * @param id Item ID
   * @param data Partial data to update
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    await this.delay(400); // Slightly longer delay for update operations
    
    const index = this.data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`${this.entityName} with ID ${id} not found`);
    }
    
    // Update the item
    const updatedItem = {
      ...this.data[index],
      ...data,
      updated_at: new Date().toISOString()
    } as unknown as T;
    
    this.data[index] = updatedItem;
    
    return { ...updatedItem }; // Return a copy
  }
  
  /**
   * Delete an item
   * @param id Item ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    await this.delay(500); // Longer delay for delete operations
    
    const index = this.data.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`${this.entityName} with ID ${id} not found`);
    }
    
    // Remove from array
    this.data.splice(index, 1);
    
    return { success: true };
  }
  
  /**
   * Search items by text query
   * @param query Search query
   * @param fields Fields to search in
   */
  async search(query: string, fields: (keyof T)[]): Promise<T[]> {
    await this.delay();
    
    if (!query) {
      return [...this.data]; // Return all if no query
    }
    
    const lowerQuery = query.toLowerCase();
    
    return this.data.filter(item => {
      return fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      });
    });
  }
  
  /**
   * Get the current data (primarily for debugging)
   */
  getData(): T[] {
    return [...this.data];
  }
  
  /**
   * Reset the service data (useful for testing)
   * @param newData Optional new data to replace the current data
   */
  resetData(newData?: T[]): void {
    this.data = newData ? [...newData] : [];
  }
}

/**
 * Factory function to create a MockDataService with pre-configured delay
 * @param initialData Initial data array
 * @param entityName Name of the entity
 * @param delayMs Optional delay in milliseconds (defaults to env var or 300ms)
 */
export function createMockDataService<T extends Entity>(
  initialData: T[],
  entityName: string,
  delayMs?: number
): MockDataService<T> {
  // Use environment variable if available, otherwise use provided value or default
  const delay = delayMs ?? (
    typeof process !== 'undefined' && 
    process.env.NEXT_PUBLIC_MOCK_DELAY ? 
    parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY) : 
    300
  );
  
  return new MockDataService<T>(initialData, entityName, delay);
}
