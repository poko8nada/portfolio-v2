// scripts/prepare-resume.js
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  cpSync,
} from 'node:fs'
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

// MD合体機能（汎用）
function mergeMarkdownFiles(subDir, outputFileName) {
  const resumeDir = 'src/content/resume'
  const sourceDir = join(resumeDir, subDir)
  const outputPath = join(resumeDir, outputFileName)

  try {
    // 指定パターンのファイルを検索
    const pattern = new RegExp(`^${subDir}_\\d+_.+\\.md$`)
    const files = readdirSync(sourceDir)
      .filter(file => pattern.test(file))
      .sort() // ファイル名でソート（連番順）

    if (files.length === 0) {
      console.log(`⚠️  ${subDir}_*.md ファイルが見つかりません`)
      return
    }

    let frontmatter = null
    const contents = []

    // 各ファイルを読み込んで合体
    for (const file of files) {
      const filePath = join(sourceDir, file)
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

    console.log(
      `✅ ${subDir.charAt(0).toUpperCase() + subDir.slice(1)} files merged: ${files.join(', ')} → ${outputFileName}`,
    )
    console.log(`📝 合計 ${files.length} ファイルを合体しました`)
  } catch (error) {
    console.error(`❌ ${subDir} 合体エラー: ${error.message}`)
  }
}

// Resume MDファイル合体機能（後方互換性）
function mergeResumeFiles() {
  mergeMarkdownFiles('resume', 'resume.md')
}

// Career MDファイル合体機能
function mergeCareerFiles() {
  mergeMarkdownFiles('career', 'career.md')
}

// Skills MDファイル合体機能
function mergeSkillsFiles() {
  mergeMarkdownFiles('skills', 'skills.md')
}

// 全MD合体機能
function mergeAllFiles() {
  // 常にバックアップを実行
  backupResumeFolder()

  mergeResumeFiles()
  mergeCareerFiles()
  mergeSkillsFiles()
}

// デバウンス付きResume合体
function debouncedMergeResume() {
  if (mergeTimeout) {
    clearTimeout(mergeTimeout)
    console.log('⏳ Debouncing resume merge...')
  }

  mergeTimeout = setTimeout(() => {
    console.log('🔄 Merging all markdown files...')
    // バックアップしてから合体
    backupResumeFolder()
    mergeAllFiles()
    mergeTimeout = null
  }, 3000)
}

// バックアップ機能
function backupResumeFolder() {
  const sourceDir = 'src/content/resume'
  const backupDir =
    '/Users/yuyahanada/Desktop/_works/_01docs/portfolio-v2-resume-backup'
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const timestampedBackupDir = `${backupDir}-${timestamp}`

  try {
    // バックアップディレクトリを作成（再帰的）
    mkdirSync(timestampedBackupDir, { recursive: true })

    // resumeフォルダ全体をコピー
    cpSync(sourceDir, timestampedBackupDir, { recursive: true })

    // 最新のバックアップとしてもコピー（タイムスタンプなし）
    mkdirSync(backupDir, { recursive: true })
    cpSync(sourceDir, backupDir, { recursive: true })

    console.log(`✅ Resume backup created: ${timestampedBackupDir}`)
    console.log(`✅ Latest backup updated: ${backupDir}`)
  } catch (error) {
    console.error(`❌ バックアップエラー: ${error.message}`)
  }
}

// コマンドライン処理
const args = process.argv.slice(2)
const command = args[0]
const imageFile = args[1]

if (command === '--images') {
  convertImage(imageFile)
} else if (command === '--merge') {
  backupResumeFolder()
  mergeResumeFiles()
} else if (command === '--merge-career') {
  backupResumeFolder()
  mergeCareerFiles()
} else if (command === '--merge-skills') {
  backupResumeFolder()
  mergeSkillsFiles()
} else if (command === '--merge-all') {
  backupResumeFolder()
  mergeAllFiles()
} else if (command === '--merge-debounce') {
  debouncedMergeResume()
} else if (command === '--backup') {
  backupResumeFolder()
} else if (command === '--all') {
  convertImage(imageFile)
  mergeAllFiles()
} else {
  // デフォルト動作（後方互換性）
  convertImage(command || 'profile.png')
}
