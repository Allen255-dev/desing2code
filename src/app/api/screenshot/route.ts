import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Using Microlink API to get a screenshot
        // Microlink provides a simple way to get screenshots via URL search params
        const screenshotUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;

        const response = await fetch(screenshotUrl);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
        }

        const data = await response.json();
        const imageUrl = data.data.screenshot.url;

        if (!imageUrl) {
            return NextResponse.json({ error: 'Screenshot URL not found in response' }, { status: 500 });
        }

        // Fetch image and convert to base64
        const imageRes = await fetch(imageUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = imageRes.headers.get('content-type') || 'image/png';

        return NextResponse.json({ image: `data:${mimeType};base64,${base64}` });
    } catch (error: any) {
        console.error('Screenshot error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
