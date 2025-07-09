import fs from 'fs';
import path from 'path';
import { StorageInterface, UrlData } from './interface';

export class JsonStorage implements StorageInterface {
  private dataDir: string;
  private dataFile: string;

  constructor(dataPath?: string) {
    this.dataDir = dataPath ? path.dirname(dataPath) : path.join(process.cwd(), 'data');
    this.dataFile = dataPath || path.join(this.dataDir, 'urls.json');
  }

  async initialize(): Promise<void> {
    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Initialize data file if it doesn't exist
    if (!fs.existsSync(this.dataFile)) {
      fs.writeFileSync(this.dataFile, JSON.stringify({}));
    }
  }

  private readData(): Record<string, UrlData> {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON data file:', error);
      return {};
    }
  }

  private writeData(data: Record<string, UrlData>): void {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing JSON data file:', error);
    }
  }

  async create(shortCode: string, urlData: UrlData): Promise<void> {
    const data = this.readData();
    data[shortCode] = urlData;
    this.writeData(data);
  }

  async findByShortCode(shortCode: string): Promise<UrlData | null> {
    const data = this.readData();
    return data[shortCode] || null;
  }

  async update(shortCode: string, updates: Partial<UrlData>): Promise<void> {
    const data = this.readData();
    if (data[shortCode]) {
      data[shortCode] = { ...data[shortCode], ...updates };
      this.writeData(data);
    }
  }

  async getAll(): Promise<UrlData[]> {
    const data = this.readData();
    return Object.values(data).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async incrementClicks(shortCode: string): Promise<void> {
    const data = this.readData();
    if (data[shortCode]) {
      data[shortCode].clicks += 1;
      data[shortCode].lastAccessed = new Date().toISOString();
      this.writeData(data);
    }
  }

  async updateLastAccessed(shortCode: string, timestamp: string): Promise<void> {
    const data = this.readData();
    if (data[shortCode]) {
      data[shortCode].lastAccessed = timestamp;
      this.writeData(data);
    }
  }

  async exists(shortCode: string): Promise<boolean> {
    const data = this.readData();
    return !!data[shortCode];
  }

  async delete(shortCode: string): Promise<void> {
    const data = this.readData();
    delete data[shortCode];
    this.writeData(data);
  }
}