import { NextRequest, NextResponse } from 'next/server';
import { StorageFactory } from '@/app/lib/storage/factory';

export async function GET(request: NextRequest) {
  try {
    const storage = await StorageFactory.getStorage();
    const urls = await storage.getAll();

    return NextResponse.json({
      success: true,
      urls: urls.map(url => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastAccessed: url.lastAccessed
      }))
    });

  } catch (error) {
    console.error('Error getting URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}