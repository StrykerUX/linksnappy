import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/app/lib/storage';

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

    return NextResponse.json({
      success: true,
      ...data[shortCode]
    });

  } catch (error) {
    console.error('Error getting URL info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}