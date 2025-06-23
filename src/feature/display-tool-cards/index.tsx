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
