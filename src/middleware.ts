import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// /resumeパスにのみBasic認証を適用
export const config = {
  matcher: '/resume/:path*',
}

function isBasicAuthValid(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }

  const base64Credentials = authHeader.slice(6)
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
  const [username, password] = credentials.split(':')

  // 環境変数から認証情報を取得
  const validUsername = process.env.BASIC_AUTH_USERNAME
  const validPassword = process.env.BASIC_AUTH_PASSWORD

  return username === validUsername && password === validPassword
}

export function middleware(request: NextRequest) {
  // Basic認証チェック
  if (!isBasicAuthValid(request)) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      },
    })
  }

  // 認証成功時もX-Robots-Tagヘッダーを追加
  const response = NextResponse.next()
  response.headers.set(
    'X-Robots-Tag',
    'noindex, nofollow, noarchive, nosnippet',
  )

  return response
}
