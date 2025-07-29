import { AwsClient } from 'aws4fetch'
import { type NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

/**
 * Extracts object keys from the XML response of the S3 ListObjectsV2 API.
 * @param xmlText The XML response as a string.
 * @returns An array of object keys.
 */
function getKeysFromXml(xmlText: string): string[] {
  const keys: string[] = []
  const keyRegex = /<Key>(.*?)<\/Key>/g
  let match: RegExpExecArray | null = keyRegex.exec(xmlText)

  while (match !== null) {
    keys.push(match[1])
    match = keyRegex.exec(xmlText)
  }
  return keys
}

/**
 * Fetches the latest resume content from R2 using aws4fetch.
 * @param slug The slug for the resume content (e.g., "skills", "career").
 * @returns The content of the latest markdown file, or null if not found.
 */
async function getResumeContent(slug: string): Promise<string | null> {
  const {
    R2_BUCKET_NAME,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_ACCOUNT_ID,
  } = process.env

  if (
    !R2_BUCKET_NAME ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !CLOUDFLARE_ACCOUNT_ID
  ) {
    console.error('[API-aws4fetch] Missing required R2 environment variables.')
    throw new Error('Server configuration error: Missing R2 credentials.')
  }

  const aws = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    region: 'auto', // R2 doesn't use regions, 'auto' is a safe default
  })

  const prefix = `resume/${slug}_`
  const r2Host = `${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`

  // 1. List objects to find the latest version
  const listUrl = `https://${r2Host}/${R2_BUCKET_NAME}/?list-type=2&prefix=${encodeURIComponent(prefix)}`
  console.log(`[API-aws4fetch] Listing objects with URL: ${listUrl}`)

  const listResponse = await aws.fetch(listUrl)
  if (!listResponse.ok) {
    console.error(
      `[API-aws4fetch] Failed to list objects: ${listResponse.status} ${listResponse.statusText}`,
    )
    return null
  }

  const xmlText = await listResponse.text()
  const objectKeys = getKeysFromXml(xmlText)

  if (objectKeys.length === 0) {
    return null
  }

  // 2. Sort keys to find the most recent file
  const latestKey = objectKeys.sort((a, b) => b.localeCompare(a))[0]

  // 3. Get the content of the latest object
  const getUrl = `https://${r2Host}/${R2_BUCKET_NAME}/${latestKey}`
  const getResponse = await aws.fetch(getUrl)
  if (!getResponse.ok) {
    console.error(
      `[API-aws4fetch] Failed to get object: ${getResponse.status} ${getResponse.statusText}`,
    )
    return null
  }

  const content = await getResponse.text()
  return content
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const body = await getResumeContent(slug)
    if (body === null) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return new Response(body, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[API] Unhandled error for slug:', errorMessage)
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 },
    )
  }
}
