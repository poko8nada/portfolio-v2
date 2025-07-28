import { AwsClient } from 'aws4fetch'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Validates if the referer is from an allowed host.
 * Allows localhost for local development and preview, and a specific domain for production.
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

    return (
      hostname === 'localhost' || // Local development and preview
      hostname.endsWith('.workers.dev') || // Cloudflare preview URLs
      hostname === 'pokohanada.com' || // Production domain
      hostname.endsWith('.pokohanada.com') // Production subdomains
    )
  } catch (_error) {
    return false
  }
}

/**
 * Determines the MIME type of a file based on its extension.
 * @param {string} filename - The name of the file.
 * @returns {string} The corresponding Content-Type.
 */
function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    case 'webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

/**
 * Extracts object keys from the XML response of the S3 ListObjectsV2 API.
 * @param {string} xmlText - The XML response as a string.
 * @returns {string[]} An array of object keys.
 */
function getKeysFromXml(xmlText: string): string[] {
  const keys: string[] = []
  const keyRegex = /<Key>(.*?)<\/Key>/g
  const matches = xmlText.matchAll(keyRegex)

  for (const match of matches) {
    if (match[1]) {
      keys.push(match[1])
    }
  }
  return keys
}

/**
 * Fetches the latest version of an image from R2 using aws4fetch.
 * @param {string} imagePath - The relative path of the image (e.g., "images/profile.png").
 * @returns {Promise<ArrayBuffer | null>} The image data as an ArrayBuffer, or null if not found.
 */
async function getImageDataFromR2(
  imagePath: string,
): Promise<ArrayBuffer | null> {
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
    console.error('[API-ProxyImage] Missing required R2 environment variables.')
    throw new Error('Server configuration error: Missing R2 credentials.')
  }

  const aws = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    region: 'auto',
  })

  // Correctly build the prefix to account for timestamps
  const lastDotIndex = imagePath.lastIndexOf('.')
  if (lastDotIndex === -1) {
    console.error(
      `[API-ProxyImage] Invalid imagePath (no extension): ${imagePath}`,
    )
    return null
  }
  const basePath = imagePath.substring(0, lastDotIndex)
  const prefix = `resume/${basePath}_` // e.g., "images/profile.png" -> "resume/images/profile_"
  const r2Host = `${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`

  // 1. List objects to find the latest version
  const listUrl = `https://${r2Host}/${R2_BUCKET_NAME}/?list-type=2&prefix=${encodeURIComponent(prefix)}`
  const listResponse = await aws.fetch(listUrl)

  if (!listResponse.ok) {
    console.error(
      `[API-ProxyImage] Failed to list objects: ${listResponse.status} ${listResponse.statusText}`,
    )
    return null
  }

  const xmlText = await listResponse.text()
  const objectKeys = getKeysFromXml(xmlText)

  if (objectKeys.length === 0) {
    console.log(`[API-ProxyImage] No objects found with prefix: ${prefix}`)
    return null
  }

  // 2. Sort keys to find the most recent file
  const latestKey = objectKeys.sort((a, b) => b.localeCompare(a))[0]

  // 3. Get the content of the latest object
  const getUrl = `https://${r2Host}/${R2_BUCKET_NAME}/${latestKey}`
  const getResponse = await aws.fetch(getUrl)

  if (!getResponse.ok) {
    console.error(
      `[API-ProxyImage] Failed to get object: ${getResponse.status} ${getResponse.statusText}`,
    )
    return null
  }

  return getResponse.arrayBuffer()
}

export async function GET(request: Request) {
  // 1. Referer check
  const referer = request.headers.get('referer')
  if (!isRefererAllowed(referer)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Get image path from query parameter
  const { searchParams } = new URL(request.url)
  const imagePath = searchParams.get('path')

  if (!imagePath) {
    return NextResponse.json(
      { error: 'Image path is required' },
      { status: 400 },
    )
  }

  try {
    // 3. Fetch image data from R2
    const imageData = await getImageDataFromR2(imagePath)

    if (imageData === null) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // 4. Return the image data as a response
    const headers = new Headers()
    headers.set('Content-Type', getContentType(imagePath))
    headers.set('Cache-Control', 'public, max-age=604800, immutable') // 7-day cache

    return new Response(imageData, { headers })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[API-ProxyImage] Unhandled error:', errorMessage)
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 },
    )
  }
}
