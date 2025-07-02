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
    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-x-10 w-full'>
      {sections.map(section => (
        <section key={section.title} className='flex flex-col'>
          <h2 className='text-base font-mono font-extralight mb-7 pl-1 uppercase text-pr/80 tracking-widest opacity-90'>
            {section.title}
          </h2>
          <ul className='flex flex-wrap gap-x-3 gap-y-4'>
            {section.items.map(skill => (
              <li
                key={skill}
                className={`${jetbrainsMono.className} rounded-full bg-white/5 border border-white/15 px-4 py-1.5 text-fg text-sm font-light tracking-tight select-none opacity-90`}
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
