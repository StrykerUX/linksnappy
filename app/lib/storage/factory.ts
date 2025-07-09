import { StorageInterface } from './interface';
import { JsonStorage } from './json-storage';
import { PostgreSQLStorage } from './postgresql-storage';

export class StorageFactory {
  private static instance: StorageInterface | null = null;

  static async getStorage(): Promise<StorageInterface> {
    if (this.instance) {
      return this.instance;
    }

    const storageType = process.env.STORAGE_TYPE || 'json';
    
    switch (storageType.toLowerCase()) {
      case 'postgresql':
      case 'postgres':
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          console.warn('⚠️  DATABASE_URL not found, falling back to JSON storage');
          this.instance = new JsonStorage();
        } else {
          console.log('🐘 Using PostgreSQL storage');
          this.instance = new PostgreSQLStorage(databaseUrl);
        }
        break;
        
      case 'json':
      default:
        console.log('📁 Using JSON file storage');
        this.instance = new JsonStorage();
        break;
    }

    // Initialize the storage
    await this.instance.initialize();
    
    return this.instance;
  }

  // For testing or manual storage switching
  static setStorage(storage: StorageInterface): void {
    this.instance = storage;
  }

  // Reset instance (useful for testing)
  static reset(): void {
    this.instance = null;
  }
}

// Utility functions to maintain backward compatibility
export const getBaseUrl = (): string => {
  return process.env.BASE_URL || 
         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
         process.env.NODE_ENV === 'production' ? 'https://linksnappy.imstryker.com' :
         'http://localhost:3000';
};

export const isValidUrl = (string: string): boolean => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

export const generateShortCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};