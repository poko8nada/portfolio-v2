import { getCloudflareContext } from '@opennextjs/cloudflare'
import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Validates if the referer is from an allowed host.
 * In development, it allows localhost with any port.
 * In production, it strictly checks against the deployed domain.
 * @param {string | null} referer - The referer header from the request.
 * @returns {boolean} - True if the referer is allowed, false otherwise.
 */
function isRefererAllowed(referer: string | null): boolean {
  if (!referer) {
    return false
  }

  try {
    const refererUrl = new URL(referer)
    const hostname = refererUrl.hostname

    if (process.env.NODE_ENV === 'development') {
      // For `pnpm dev` (e.g., localhost:3000) and `pnpm preview` (e.g., localhost:8787)
      return hostname === 'localhost'
    }

    // For production
    return hostname === 'pokohanada.com' || hostname.endsWith('.pokohanada.com')
  } catch (_error) {
    return false
  }
}


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

/**
 * R2から最新バージョンの画像を取得する
 */
async function getImageFromR2(imagePath: string, r2Bucket: R2Bucket) {
  const prefix = `resume/images/${imagePath}`
  const list = await r2Bucket.list({ prefix })

  if (list.objects.length === 0) {
    return null
  }

  // タイムスタンプで降順ソートして最新のファイルを見つける
  const latestObject = list.objects.sort((a, b) =>
    b.key.localeCompare(a.key),
  )[0]

  const object = await r2Bucket.get(latestObject.key)
  return object
}

/**
 * ローカルファイルシステムから画像を取得する (開発環境用フォールバック)
 */
async function getImageFromLocal(imagePath: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/content/resume/images', imagePath)
    const buffer = await fs.readFile(filePath)
    return buffer
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null // ファイルが存在しない場合はnull
    }
    throw error // その他のエラーは再スロー
  }
}

export async function GET(request: Request) {
  // 1. Refererチェック
  const referer = request.headers.get('referer');
  if (!isRefererAllowed(referer)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. クエリパラメータから画像パスを取得
  const { searchParams } = new URL(request.url);
  const imagePath = searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  let imageData: ArrayBuffer | Uint8Array | null = null

  try {
    // Cloudflare環境かどうかを判定
    const { env } = getCloudflareContext<CloudflareEnv & Record<string, unknown>>()
    const { PORTFOLIO_ASSETS } = env

    if (!PORTFOLIO_ASSETS) {
      throw new Error('R2 bucket binding not found in Cloudflare environment')
    }

    console.log(`Fetching latest version of image \"${imagePath}\" from R2...`)
    const object = await getImageFromR2(imagePath, PORTFOLIO_ASSETS)

    if (object === null) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    imageData = await object.arrayBuffer()

  } catch (_e) {
    // getCloudflareContextが失敗した場合、ローカル開発環境とみなす
    console.log(`Cloudflare context not found, falling back to local file system for image \"${imagePath}\"...`)
    const buffer = await getImageFromLocal(imagePath)
    if (buffer === null) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    imageData = buffer
  }

  // レスポンスを返す
  const headers = new Headers();
  headers.set('Content-Type', getContentType(imagePath));
  headers.set('Cache-Control', 'public, max-age=604800, immutable'); // 7日間キャッシュ

  return new Response(imageData, { headers });
}
