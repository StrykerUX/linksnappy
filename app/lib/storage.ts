import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'urls.json');

export interface UrlData {
  originalUrl: string;
  shortCode: string;
  qrCode: string;
  clicks: number;
  createdAt: string;
  lastAccessed: string | null;
}

export interface UrlStorage {
  [shortCode: string]: UrlData;
}

// Ensure data directory exists
export const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Initialize data file if it doesn't exist
export const ensureDataFile = () => {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  }
};

// Read data from file
export const readData = (): UrlStorage => {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return {};
  }
};

// Write data to file
export const writeData = (data: UrlStorage): void => {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Validate URL
export const isValidUrl = (string: string): boolean => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Generate short code
export const generateShortCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get base URL
export const getBaseUrl = (): string => {
  return process.env.BASE_URL || 
         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
         process.env.NODE_ENV === 'production' ? 'https://your-domain.com' :
         'http://localhost:3000';
};