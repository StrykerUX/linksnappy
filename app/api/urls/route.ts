import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/app/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const data = readData();
    const urls = Object.values(data).map(url => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      lastAccessed: url.lastAccessed
    }));

    // Sort by creation date (newest first)
    urls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      urls
    });

  } catch (error) {
    console.error('Error getting URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}