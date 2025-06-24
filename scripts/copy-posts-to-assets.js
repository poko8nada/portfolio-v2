#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_SOURCE = path.join(process.cwd(), 'src/posts')
const ASSETS_DESTINATION = path.join(process.cwd(), '.open-next/assets/posts')
const VERSION_CACHE_FILE = path.join(ASSETS_DESTINATION, '.version-cache.json')

/**
 * 配布先ディレクトリを作成
 */
function ensureDestinationDirectory() {
  if (!fs.existsSync(ASSETS_DESTINATION)) {
    fs.mkdirSync(ASSETS_DESTINATION, { recursive: true })
    console.log(`📁 作成: ${ASSETS_DESTINATION}`)
  }
}

/**
 * バージョンキャッシュを読み込み
 */
function loadVersionCache() {
  let versionCache = {}
  if (fs.existsSync(VERSION_CACHE_FILE)) {
    try {
      const content = fs.readFileSync(VERSION_CACHE_FILE, 'utf-8')
      versionCache = JSON.parse(content)
      console.log(
        `📋 バージョンキャッシュ読み込み: ${Object.keys(versionCache).length}件`,
      )
    } catch (error) {
      console.warn('⚠️ バージョンキャッシュの読み込みに失敗:', error.message)
      console.warn('⚠️ 新しいキャッシュファイルを作成します')
    }
  } else {
    console.log('📋 新しいバージョンキャッシュを作成')
  }
  return versionCache
}

/**
 * 日付を YYYY-MM-DD 形式に変換
 */
function formatDate(date) {
  if (!date) return null
  if (typeof date === 'string') return date.slice(0, 10)
  if (date instanceof Date) return date.toISOString().slice(0, 10)
  return null
}

// 初期化
ensureDestinationDirectory()
const versionCache = loadVersionCache()

// src/postsからmdファイルを読み取り
const files = fs.readdirSync(POSTS_SOURCE)
const mdFiles = files.filter(file => file.endsWith('.md'))

console.log(`📚 処理対象: ${mdFiles.length}件のMarkdownファイル`)

const processedPosts = []
const stats = { copied: 0, skipped: 0, errors: 0 }

for (const file of mdFiles) {
  try {
    const sourcePath = path.join(POSTS_SOURCE, file)
    const slug = file.replace('.md', '')

    // ファイルの存在確認
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️ ファイルが見つかりません: ${file}`)
      stats.errors++
      continue
    }

    const mdContent = fs.readFileSync(sourcePath, 'utf-8')
    const { data } = matter(mdContent)

    // 必須フィールドの検証
    if (!data.title) {
      console.warn(`⚠️ タイトルが設定されていません: ${file}`)
      stats.errors++
      continue
    }

    // 公開チェック
    if (!data.isPublished) {
      console.log(`⏭️  スキップ（非公開）: ${file}`)
      stats.skipped++
      continue
    }

    // バージョン比較
    const currentVersion = data.version || 1
    const cachedVersion = versionCache[slug] || 0

    if (currentVersion <= cachedVersion) {
      console.log(
        `⏭️  スキップ（バージョン未更新）: ${file} (v${currentVersion})`,
      )
      stats.skipped++

      // インデックス用データは追加（既存情報を保持）
      processedPosts.push({
        slug,
        title: String(data.title),
        createdAt: formatDate(data.createdAt),
        updatedAt: formatDate(data.updatedAt),
        thumbnail: data.thumbnail
          ? String(data.thumbnail)
          : '/images/pencil01.svg',
        version: currentVersion,
      })
      continue
    }

    // mdファイルをコピー
    const destPath = path.join(ASSETS_DESTINATION, file)
    fs.copyFileSync(sourcePath, destPath)
    console.log(
      `✅ コピー完了: ${file} (v${cachedVersion} → v${currentVersion})`,
    )
    stats.copied++

    // バージョンキャッシュを更新
    versionCache[slug] = currentVersion

    // インデックス用データを追加
    processedPosts.push({
      slug,
      title: String(data.title),
      createdAt: formatDate(data.createdAt),
      updatedAt: formatDate(data.updatedAt),
      thumbnail: data.thumbnail
        ? String(data.thumbnail)
        : '/images/pencil01.svg',
      version: currentVersion,
    })
  } catch (error) {
    console.error(`❌ エラー: ${file}`, error.message)
    stats.errors++
  }
}

// 古いキャッシュエントリの清理
const currentSlugs = new Set(mdFiles.map(f => f.replace('.md', '')))
const cacheKeys = Object.keys(versionCache)
const removedKeys = cacheKeys.filter(key => !currentSlugs.has(key))

for (const key of removedKeys) {
  delete versionCache[key]
  console.log(`🗑️  キャッシュから削除: ${key}`)
}

// 作成日時でソート（新しい順）
processedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

// バージョンキャッシュを保存
try {
  fs.writeFileSync(VERSION_CACHE_FILE, JSON.stringify(versionCache, null, 2))
  console.log('💾 バージョンキャッシュ保存完了')
} catch (error) {
  console.error('❌ バージョンキャッシュの保存に失敗:', error.message)
}

// リッチインデックスを保存
try {
  const indexPath = path.join(ASSETS_DESTINATION, 'index.json')
  fs.writeFileSync(indexPath, JSON.stringify(processedPosts, null, 2))
  console.log('📄 リッチインデックスファイル作成: index.json')
} catch (error) {
  console.error('❌ インデックスファイルの保存に失敗:', error.message)
}

// 結果サマリー
console.log('\n🎉 処理完了:')
console.log(`   ✅ コピー: ${stats.copied}件`)
console.log(`   ⏭️  スキップ: ${stats.skipped}件`)
console.log(`   ❌ エラー: ${stats.errors}件`)
console.log(`   📚 合計インデックス: ${processedPosts.length}件`)

if (stats.errors > 0) {
  process.exit(1)
}
