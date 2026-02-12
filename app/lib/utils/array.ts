/**
 * Array manipulation and data transformation utilities
 * @module lib/utils/array
 */

/**
 * Ensure value is an array with proper fallback
 * 
 * @param arr - Value to convert to array
 * @param defaultVal - Default value for array items
 * @returns Array of values
 */
export function safeArray(arr: any[], defaultVal: string = ''): string[] {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return [defaultVal];
  return arr.filter((item) => item != null && item !== '');
}

/**
 * Count occurrences in array and return aggregated data
 * 
 * @param data - Array of objects to count
 * @param options - Configuration for counting
 * @returns Array of counted items with metadata
 */
export function countArray(
  data: any[],
  options: { key?: string; keyname: string; keep?: string[] }
): any[] {
  const { key, keyname, keep = [] } = options;
  
  const counts: Record<string, any> = {};
  
  data.forEach((item) => {
    const values = key ? item[key] : [item];
    const arrayValues = Array.isArray(values) ? values : [values];
    
    arrayValues.forEach((value: any) => {
      if (value != null && value !== '') {
        const valueKey = typeof value === 'object' ? JSON.stringify(value) : value;
        
        if (!counts[valueKey]) {
          counts[valueKey] = {
            [keyname]: value,
            count: 0,
          };
          
          // Keep specified fields from original item
          keep.forEach((field) => {
            if (item[field] !== undefined) {
              counts[valueKey][field] = item[field];
            }
          });
        }
        
        counts[valueKey].count += 1;
      }
    });
  });
  
  return Object.values(counts).sort((a, b) => b.count - a.count);
}

/**
 * Join multiple arrays by matching IDs
 * Similar to SQL JOIN operation
 * 
 * @param mainArray - Primary array
 * @param joinArrays - Arrays to join with their ID field names
 * @returns Joined array
 */
export function multiJoin(
  mainArray: any[],
  joinArrays: [any[], string][]
): any[] {
  return mainArray.map((mainItem) => {
    const joinedItem = { ...mainItem };
    
    joinArrays.forEach(([joinArray, idField]) => {
      const matchedItems = joinArray.filter(
        (joinItem) => joinItem[idField] === mainItem.id
      );
      
      if (matchedItems.length > 0) {
        Object.assign(joinedItem, ...matchedItems);
      }
    });
    
    return joinedItem;
  });
}

/**
 * Group array items by a specific key
 * 
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicate items from array
 * 
 * @param array - Array to deduplicate
 * @param key - Optional key for object arrays
 * @returns Deduplicated array
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Chunk array into smaller arrays of specified size
 * 
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten nested array structure
 * 
 * @param array - Nested array
 * @param depth - Maximum depth to flatten (default: Infinity)
 * @returns Flattened array
 */
export function flattenDeep<T>(array: any[], depth: number = Infinity): T[] {
  if (depth < 1) return array.slice();
  
  return array.reduce((acc, val) => {
    return acc.concat(Array.isArray(val) ? flattenDeep(val, depth - 1) : val);
  }, []);
}

/**
 * Sort array of objects by a key
 * 
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Legacy alias for safeArray
 * @deprecated Use safeArray instead
 */
export const safeArr = safeArray;
