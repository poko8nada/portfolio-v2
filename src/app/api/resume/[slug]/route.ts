import fs from 'node:fs/promises'
import path from 'node:path'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * R2から最新バージョンのコンテンツを取得する
 */
async function getResumeFromR2(slug: string, r2Bucket: R2Bucket) {
  const prefix = `resume/${slug}`
  const list = await r2Bucket.list({ prefix })

  if (list.objects.length === 0) {
    return null
  }

  // タイムスタンプで降順ソートして最新のファイルを見つける
  const latestObject = list.objects.sort((a, b) =>
    b.key.localeCompare(a.key),
  )[0]

  const object = await r2Bucket.get(latestObject.key)
  if (object === null) {
    return null // 念のためチェック
  }
  return object.text()
}

/**
 * ローカルファイルシステムからコンテンツを取得する (開発環境用フォールバック)
 */
async function getResumeFromLocal(slug: string) {
  try {
    // タイムスタンプなしの固定ファイル名を読む
    const filePath = path.join(
      process.cwd(),
      'src/content/resume',
      `${slug}.md`,
    )
    return await fs.readFile(filePath, 'utf-8')
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null // ファイルが存在しない場合はnull
    }
    throw error // その他のエラーは再スロー
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params
  let body: string | null = null

  try {
    // Cloudflare環境かどうかを判定
    const { env } = getCloudflareContext<
      CloudflareEnv & Record<string, unknown>
    >()
    const { PORTFOLIO_ASSETS } = env

    if (!PORTFOLIO_ASSETS) {
      throw new Error('R2 bucket binding not found in Cloudflare environment')
    }
    console.log(`Fetching latest version of \"${slug}\" from R2...`)
    body = await getResumeFromR2(slug, PORTFOLIO_ASSETS)
  } catch (_e) {
    // getCloudflareContextが失敗した場合、ローカル開発環境とみなす
    console.log(
      `Cloudflare context not found, falling back to local file system for \"${slug}"...`,
    )
    body = await getResumeFromLocal(slug)
  }

  // コンテンツが見つからない場合の処理
  if (body === null) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  // 成功レスポンス
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
