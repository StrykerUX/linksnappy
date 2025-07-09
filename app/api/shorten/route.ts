import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { StorageFactory, isValidUrl, generateShortCode, getBaseUrl } from '@/app/lib/storage/factory';
import { UrlData } from '@/app/lib/storage/interface';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const storage = await StorageFactory.getStorage();
    let shortCode = generateShortCode();
    
    // Ensure unique short code
    while (await storage.exists(shortCode)) {
      shortCode = generateShortCode();
    }

    const baseUrl = getBaseUrl();
    const shortUrl = `${baseUrl}/${shortCode}`;

    // Generate QR code
    const qrCode = await QRCode.toDataURL(shortUrl);

    // Create URL data
    const urlData: UrlData = {
      originalUrl: url,
      shortCode,
      qrCode,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastAccessed: null
    };

    // Store URL data
    await storage.create(shortCode, urlData);

    return NextResponse.json({
      success: true,
      shortCode,
      shortUrl,
      originalUrl: url,
      qrCode,
      createdAt: urlData.createdAt
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}