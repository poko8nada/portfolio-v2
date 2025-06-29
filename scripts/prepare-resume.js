// scripts/prepare-resume.js
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { extname, basename, join } from 'node:path'
import matter from 'gray-matter'

// デバウンス用タイマー
let mergeTimeout = null

// 画像変換機能（既存機能）
function convertImage(inputFilename = 'profile.png') {
  const imagePath = `src/content/resume/images/${inputFilename}`
  const outputPath = `src/content/resume/images/${inputFilename.replace(/\.[^.]+$/, '.json')}`

  try {
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
  } catch (error) {
    console.error(`❌ 画像変換エラー: ${error.message}`)
  }
}

// Resume MDファイル合体機能
function mergeResumeFiles() {
  const resumeDir = 'src/content/resume'
  const outputPath = join(resumeDir, 'resume.md')

  try {
    // resume_*.md パターンのファイルを検索
    const files = readdirSync(resumeDir)
      .filter(file => file.match(/^resume_\d+_.+\.md$/))
      .sort() // ファイル名でソート（連番順）

    if (files.length === 0) {
      console.log('⚠️  resume_*.md ファイルが見つかりません')
      return
    }

    let frontmatter = null
    const contents = []

    // 各ファイルを読み込んで合体
    for (const file of files) {
      const filePath = join(resumeDir, file)
      const fileContent = readFileSync(filePath, 'utf8')
      const parsed = matter(fileContent)

      // 最初のファイルのfrontmatterを使用
      if (!frontmatter) {
        frontmatter = parsed.data
        // updatedAtを現在時刻に更新
        frontmatter.updatedAt = new Date().toISOString().split('T')[0]
      }

      // コンテンツ部分を追加
      if (parsed.content.trim()) {
        contents.push(parsed.content.trim())
      }
    }

    // 合体結果を作成
    const mergedContent = matter.stringify(contents.join('\n\n'), frontmatter)

    // ファイル出力
    writeFileSync(outputPath, mergedContent)

    console.log(`✅ Resume files merged: ${files.join(', ')} → resume.md`)
    console.log(`📝 合計 ${files.length} ファイルを合体しました`)
  } catch (error) {
    console.error(`❌ Resume合体エラー: ${error.message}`)
  }
}

// デバウンス付きResume合体
function debouncedMergeResume() {
  if (mergeTimeout) {
    clearTimeout(mergeTimeout)
    console.log('⏳ Debouncing resume merge...')
  }

  mergeTimeout = setTimeout(() => {
    console.log('🔄 Merging resume files...')
    mergeResumeFiles()
    mergeTimeout = null
  }, 3000)
}

// コマンドライン処理
const args = process.argv.slice(2)
const command = args[0]
const imageFile = args[1]

if (command === '--images') {
  convertImage(imageFile)
} else if (command === '--merge') {
  mergeResumeFiles()
} else if (command === '--merge-debounce') {
  debouncedMergeResume()
} else if (command === '--all') {
  convertImage(imageFile)
  mergeResumeFiles()
} else {
  // デフォルト動作（後方互換性）
  convertImage(command || 'profile.png')
}
