import { NextRequest, NextResponse } from 'next/server';
import { StorageFactory } from '@/app/lib/storage/factory';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const storage = await StorageFactory.getStorage();
    
    const urlData = await storage.findByShortCode(shortCode);
    if (!urlData) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Update analytics
    await storage.incrementClicks(shortCode);

    return NextResponse.json({
      success: true,
      redirectUrl: urlData.originalUrl
    });

  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}