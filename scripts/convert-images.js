// scripts/convert-images.js
import { readFileSync, writeFileSync } from 'node:fs'
import { extname, basename } from 'node:path'

// コマンドライン引数からファイル名を取得（なければデフォルト）
const inputFilename = process.argv[2] || 'profile.png'
const imagePath = `src/content/resume/images/${inputFilename}`
const outputPath = `src/content/resume/images/${inputFilename.replace(/\.[^.]+$/, '.json')}`

// 1. バイナリデータを読み込み
const imageBuffer = readFileSync(imagePath)

// 2. Base64に変換
const base64String = imageBuffer.toString('base64')

// 3. MIMEタイプを決定
const getContentType = filePath => {
  const ext = extname(filePath).toLowerCase()
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  return mimeTypes[ext] || 'image/png'
}

// 4. Data URLを作成
const mimeType = getContentType(imagePath)
const dataUrl = `data:${mimeType};base64,${base64String}`

// 5. JSONオブジェクトを作成
const imageData = {
  src: dataUrl,
  // オプション: 画像のメタデータも含める
  filename: basename(imagePath),
  size: imageBuffer.length,
  mimeType: mimeType,
}

// 6. JSONファイルとして保存
writeFileSync(outputPath, JSON.stringify(imageData, null, 2))

console.log(`✅ 画像を ${outputPath} に変換しました`)
console.log(
  `📊 ファイルサイズ: ${imageBuffer.length} bytes → ${JSON.stringify(imageData).length} bytes (base64)`,
)
console.log(`🔍 Data URL preview: ${dataUrl.substring(0, 50)}...`)
