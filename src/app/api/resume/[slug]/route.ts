import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params
    const { env } = getCloudflareContext<CloudflareEnv & Record<string, unknown>>()
    const { PORTFOLIO_ASSETS } = env

    if (!PORTFOLIO_ASSETS) {
      throw new Error('R2 bucket binding not found')
    }

    const objectKey = `resume/${slug}.md`
    const object = await PORTFOLIO_ASSETS.get(objectKey)

    if (object === null) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 },
      )
    }

    const body = await object.text()

    return new Response(body, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error fetching from R2:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
