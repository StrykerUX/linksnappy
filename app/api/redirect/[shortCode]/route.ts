import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/app/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;
    const data = readData();
    
    if (!data[shortCode]) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Update analytics
    data[shortCode].clicks += 1;
    data[shortCode].lastAccessed = new Date().toISOString();
    writeData(data);

    return NextResponse.json({
      success: true,
      redirectUrl: data[shortCode].originalUrl
    });

  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}