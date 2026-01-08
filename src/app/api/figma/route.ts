import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { figmaUrl, accessToken } = await request.json();

        if (!figmaUrl || !accessToken) {
            return NextResponse.json({ error: 'Figma URL and Access Token are required' }, { status: 400 });
        }

        // Parse Figma URL
        // Example: https://www.figma.com/file/KEY/... or https://www.figma.com/design/KEY/...
        const match = figmaUrl.match(/(?:file|design)\/([a-zA-Z0-9]+)/);
        const fileKey = match ? match[1] : null;

        const urlObj = new URL(figmaUrl);
        const nodeId = urlObj.searchParams.get('node-id')?.replace('-', ':') || '';

        if (!fileKey) {
            return NextResponse.json({ error: 'Invalid Figma URL' }, { status: 400 });
        }

        // Fetch image from Figma API
        const figmaApiUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId || '0:0'}&format=png&scale=2`;

        const response = await fetch(figmaApiUrl, {
            headers: {
                'X-Figma-Token': accessToken,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error: error.err || 'Failed to fetch from Figma' }, { status: response.status });
        }

        const data = await response.json();
        const imageUrl = data.images[nodeId || '0:0'];

        if (!imageUrl) {
            return NextResponse.json({ error: 'Could not find image for the specified node' }, { status: 404 });
        }

        // Convert external image to base64 to avoid CORS issues and for easy consumption
        const imageRes = await fetch(imageUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = imageRes.headers.get('content-type') || 'image/png';

        return NextResponse.json({ image: `data:${mimeType};base64,${base64}` });
    } catch (error: any) {
        console.error('Figma API error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
