import type { FC } from 'react'
import { jetbrainsMono } from './fonts/jetbrains-mono'

type SimpleMarkdownProps = {
  content: string
}

// Markdownをh2ごとにグループ化し、liを抽出
function parseSkillsBySection(content: string) {
  const lines = content.split('\n')
  const sections: { title: string; items: string[] }[] = []
  let currentSection: { title: string; items: string[] } | null = null
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/)
    if (h2) {
      if (currentSection) sections.push(currentSection)
      currentSection = { title: h2[1], items: [] }
      continue
    }
    const li = line.match(/^- \*\*(.+?)\*\*/)
    if (li && currentSection) {
      currentSection.items.push(li[1])
    }
  }
  if (currentSection) sections.push(currentSection)
  return sections
}

export const MarkdownForAbout: FC<SimpleMarkdownProps> = ({ content }) => {
  const sections = parseSkillsBySection(content)
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-18 md:gap-x-12 lg:gap-x-18 w-full md:px-10 lg:px-16'>
      {sections.map((section, idx) => (
        <section key={section.title} className='flex flex-col space-y-9'>
          <div className='relative group'>
            <h2 className='ml-6 text-md  text-fg leading-none group-hover:text-pr transition-colors'>
              {section.title}
            </h2>
            <span className='absolute left-1 top-0 text-xs font-mono text-fg font-light group-hover:text-pr transition-colors'>
              {String(idx + 1).padStart(2, '0')}
            </span>
          </div>

          <ul className='flex flex-wrap gap-x-2 gap-y-2.5'>
            {section.items.map((skill, skillIdx) => (
              <li
                key={skill}
                className={`${jetbrainsMono.className} group relative rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 hover:border-white/24 px-3 py-1.5 text-fg hover:text-white text-xs font-light tracking-tight select-none transition-all duration-300 ease-out cursor-default`}
                style={{
                  transitionDelay: `${skillIdx * 15}ms`, // 段階的なアニメーション
                }}
              >
                <span className='relative z-10 transition-transform duration-200 group-hover:translate-y-[-0.5px]'>
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
