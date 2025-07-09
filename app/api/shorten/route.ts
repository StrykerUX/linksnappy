import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { 
  readData, 
  writeData, 
  isValidUrl, 
  generateShortCode, 
  getBaseUrl,
  UrlData 
} from '@/app/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const data = readData();
    let shortCode = generateShortCode();
    
    // Ensure unique short code
    while (data[shortCode]) {
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
    data[shortCode] = urlData;
    writeData(data);

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