export default function AboutPage() {
  return (
    <div className='py-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>About</h1>
      <div className='prose max-w-none'>
        <p className='text-center mb-6'>こんにちは。PokoHanadaです。</p>
        <p className='text-center'>
          Webディレクター兼、デベロッパー。
          <br />
          企画から制作管理、なんなら実装まで一貫して担当します。
        </p>
        {/* 将来的にはより詳細なプロフィール情報を追加 */}
      </div>
    </div>
  )
}
