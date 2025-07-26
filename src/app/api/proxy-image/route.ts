import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_REFERER = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://pokohanada.com';

function getContentType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        case 'webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
}

export async function GET(request: Request) {
    // 1. Refererチェック
    const referer = request.headers.get('referer');
    if (!referer || !referer.startsWith(ALLOWED_REFERER)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. クエリパラメータから画像パスを取得
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
        return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    try {
        // 3. R2から画像オブジェクトを取得
        const { env } = getCloudflareContext<CloudflareEnv & Record<string, unknown>>();
        const { PORTFOLIO_ASSETS } = env;

        if (!PORTFOLIO_ASSETS) {
            throw new Error('R2 bucket binding not found');
        }

        const object = await PORTFOLIO_ASSETS.get(path);

        if (object === null) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // 4. レスポンスを返す
        const headers = new Headers();
        headers.set('Content-Type', getContentType(path));
        headers.set('Cache-Control', 'public, max-age=604800, immutable'); // 7日間キャッシュ

        return new Response(object.body, { headers });

    } catch (error) {
        console.error('Error fetching image from R2:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
