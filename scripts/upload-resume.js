// scripts/upload-resume.js
import fs from 'node:fs/promises'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import 'dotenv/config'

const SOURCE_DIR = path.join(process.cwd(), 'src/content/resume')
const R2_DESTINATION_PREFIX = 'resume' // The root folder in the R2 bucket

const { R2_BUCKET_NAME, R2_END_POINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } =
  process.env

if (
  !R2_BUCKET_NAME ||
  !R2_END_POINT ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY
) {
  console.error('Error: Missing required R2 environment variables.')
  console.error(
    'Please ensure R2_BUCKET_NAME, R2_END_POINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY are set in your .dev.vars file.',
  )
  process.exit(1)
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_END_POINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

/**
 * Generates a timestamp string in YYYYMMDDHHMMSS format.
 * @returns {string} The formatted timestamp.
 */
function getTimestamp() {
  const now = new Date()
  return now
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14)
}

/**
 * Recursively finds all file paths in a directory.
 * @param {string} dir - The directory to search.
 * @returns {Promise<string[]>} A list of full file paths.
 */
async function getFilePaths(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFilePaths(res) : res
    }),
  )
  return Array.prototype.concat(...files)
}

/**
 * Uploads a single file to R2 with a timestamped key.
 * @param {string} filePath - The full path to the local file.
 */
async function uploadFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath)
    const relativePath = path.relative(SOURCE_DIR, filePath)
    const { dir, name, ext } = path.parse(relativePath)

    const timestamp = getTimestamp()
    const newFilename = `${name}_${timestamp}${ext}`

    // Construct the R2 key, maintaining the subdirectory structure.
    // e.g., 'images/profile.png' -> 'resume/images/profile_20250727103000.png'
    const r2Key = path
      .join(R2_DESTINATION_PREFIX, dir, newFilename)
      .replace(/\\/g, '/')

    console.log(`  Uploading ${relativePath} to ${r2Key}...`)

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
    })

    await s3Client.send(command)
    console.log(`  ✅ Successfully uploaded ${r2Key}`)
  } catch (error) {
    console.error(`  ❌ Failed to upload ${filePath}:`, error)
    // Re-throw to allow Promise.all to catch it
    throw error
  }
}

/**
 * Main execution function.
 */
async function main() {
  console.log('--- Starting content upload to R2 ---')

  let allFiles
  try {
    allFiles = await getFilePaths(SOURCE_DIR)
  } catch (_error) {
    console.error(`Error reading source directory: ${SOURCE_DIR}`)
    console.error('Please ensure the `src/content/resume` directory exists.')
    process.exit(1)
  }

  if (allFiles.length === 0) {
    console.warn('No files found in the source directory. Nothing to upload.')
    return
  }

  console.log(`Found ${allFiles.length} files to upload.`)

  const uploadPromises = allFiles.map(uploadFile)

  try {
    await Promise.all(uploadPromises)
    console.log('\n--- All files uploaded successfully! ---')
  } catch (_error) {
    console.error('\n--- Upload process failed for one or more files. ---')
    process.exit(1)
  }
}

main()
