import ToolsCard from '@/components/toolsCard'

const cardsConfig = [
  {
    title: 'Slide Generator',
    description:
      'Markdownをリアルタイムでスライドに変換。エディタ・スライドビューア・PDF出力を備えたサービス。',
    img: '/images/SGlogo.svg',
    link: 'https://slide-generator.you-88451-h.workers.dev',
  },
  {
    title: 'Blog Card Maker',
    description:
      '指定したURLからOGPを取得して、ブログにリンクカードを簡単に追加できるサービス。',
    img: '/images/BCMlogo.png',
    link: 'https://link-card-generator-v2.vercel.app',
  },
  {
    title: 'Time Call Web',
    description:
      'シンプルで軽量の時報通知アプリ。時報は音声でお知らせ。1分〜60分間隔で設定が可能。',
    img: '/images/timeCallWeb.png',
    link: 'https://time-call-web-v1.vercel.app',
  },
  {
    title: 'Tiny Calc',
    description:
      'ミニマルなターミナルスタイルの電卓。計算履歴の保存と再利用ができます。',
    img: '/images/tinyCalc.png',
    link: 'https://tiny-calc-894742994238.asia-northeast1.run.app/',
  },
]

export default function DisplayToolCards() {
  return (
    <div className='p-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:px-12'>
      {cardsConfig.map(card => (
        <ToolsCard
          key={card.title}
          title={card.title}
          description={card.description}
          img={card.img}
          link={card.link}
        />
      ))}
    </div>
  )
}
