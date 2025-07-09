import { Pool, PoolClient } from 'pg';
import { StorageInterface, UrlData } from './interface';

export class PostgreSQLStorage implements StorageInterface {
  private pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  async initialize(): Promise<void> {
    const client = await this.pool.connect();
    try {
      // Create table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS urls (
          short_code VARCHAR(10) PRIMARY KEY,
          original_url TEXT NOT NULL,
          qr_code TEXT NOT NULL,
          clicks INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_accessed TIMESTAMP WITH TIME ZONE
        )
      `);

      // Create index for performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at DESC)
      `);

      console.log('✅ PostgreSQL tables initialized');
    } catch (error) {
      console.error('❌ Error initializing PostgreSQL tables:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async create(shortCode: string, urlData: UrlData): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        `INSERT INTO urls (short_code, original_url, qr_code, clicks, created_at, last_accessed)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          shortCode,
          urlData.originalUrl,
          urlData.qrCode,
          urlData.clicks,
          urlData.createdAt,
          urlData.lastAccessed
        ]
      );
    } catch (error) {
      console.error('Error creating URL in PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findByShortCode(shortCode: string): Promise<UrlData | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM urls WHERE short_code = $1',
        [shortCode]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        shortCode: row.short_code,
        originalUrl: row.original_url,
        qrCode: row.qr_code,
        clicks: row.clicks,
        createdAt: row.created_at.toISOString(),
        lastAccessed: row.last_accessed ? row.last_accessed.toISOString() : null
      };
    } catch (error) {
      console.error('Error finding URL in PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(shortCode: string, updates: Partial<UrlData>): Promise<void> {
    const client = await this.pool.connect();
    try {
      const setParts: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updates.originalUrl !== undefined) {
        setParts.push(`original_url = $${paramIndex++}`);
        values.push(updates.originalUrl);
      }
      if (updates.qrCode !== undefined) {
        setParts.push(`qr_code = $${paramIndex++}`);
        values.push(updates.qrCode);
      }
      if (updates.clicks !== undefined) {
        setParts.push(`clicks = $${paramIndex++}`);
        values.push(updates.clicks);
      }
      if (updates.lastAccessed !== undefined) {
        setParts.push(`last_accessed = $${paramIndex++}`);
        values.push(updates.lastAccessed);
      }

      if (setParts.length === 0) return;

      values.push(shortCode);
      const query = `UPDATE urls SET ${setParts.join(', ')} WHERE short_code = $${paramIndex}`;
      
      await client.query(query, values);
    } catch (error) {
      console.error('Error updating URL in PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getAll(): Promise<UrlData[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM urls ORDER BY created_at DESC'
      );

      return result.rows.map(row => ({
        shortCode: row.short_code,
        originalUrl: row.original_url,
        qrCode: row.qr_code,
        clicks: row.clicks,
        createdAt: row.created_at.toISOString(),
        lastAccessed: row.last_accessed ? row.last_accessed.toISOString() : null
      }));
    } catch (error) {
      console.error('Error getting all URLs from PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async incrementClicks(shortCode: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        `UPDATE urls 
         SET clicks = clicks + 1, last_accessed = NOW() 
         WHERE short_code = $1`,
        [shortCode]
      );
    } catch (error) {
      console.error('Error incrementing clicks in PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateLastAccessed(shortCode: string, timestamp: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(
        'UPDATE urls SET last_accessed = $1 WHERE short_code = $2',
        [timestamp, shortCode]
      );
    } catch (error) {
      console.error('Error updating last accessed in PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async exists(shortCode: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT 1 FROM urls WHERE short_code = $1',
        [shortCode]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if URL exists in PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(shortCode: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('DELETE FROM urls WHERE short_code = $1', [shortCode]);
    } catch (error) {
      console.error('Error deleting URL from PostgreSQL:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Clean up connections when shutting down
  async close(): Promise<void> {
    await this.pool.end();
  }
}