export interface UrlData {
  originalUrl: string;
  shortCode: string;
  qrCode: string;
  clicks: number;
  createdAt: string;
  lastAccessed: string | null;
}

export interface StorageInterface {
  // Core operations
  create(shortCode: string, urlData: UrlData): Promise<void>;
  findByShortCode(shortCode: string): Promise<UrlData | null>;
  update(shortCode: string, updates: Partial<UrlData>): Promise<void>;
  getAll(): Promise<UrlData[]>;
  
  // Analytics operations
  incrementClicks(shortCode: string): Promise<void>;
  updateLastAccessed(shortCode: string, timestamp: string): Promise<void>;
  
  // Utility operations
  exists(shortCode: string): Promise<boolean>;
  delete(shortCode: string): Promise<void>;
  
  // Initialization
  initialize(): Promise<void>;
}

export interface StorageConfig {
  type: 'json' | 'postgresql';
  jsonFilePath?: string;
  databaseUrl?: string;
}