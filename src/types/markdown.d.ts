// TypeScript declarations for webpack asset/source
declare module '*.md' {
  const content: string
  export default content
}

// TypeScriptの型定義
type ImageData = {
  src: string
  filename: string
  size: number
  mimeType: string
}
