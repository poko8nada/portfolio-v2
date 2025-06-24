type SimpleMarkdownProps = {
  content: string
}

export function SimpleMarkdown({ content }: SimpleMarkdownProps) {
  const lines = content.split('\n')

  return (
    <div className='prose prose-gray max-w-none'>
      {lines.map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className='text-2xl font-bold mt-8 mb-6'>
              {line.substring(2)}
            </h1>
          )
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className='text-xl font-bold mt-8 mb-4'>
              {line.substring(3)}
            </h2>
          )
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className='text-lg font-semibold mt-6 mb-3'>
              {line.substring(4)}
            </h3>
          )
        }

        // List items
        if (line.startsWith('- ')) {
          return (
            <div key={index} className='ml-4 mb-1'>
              • {line.substring(2)}
            </div>
          )
        }

        // Table rows (simple)
        if (line.includes('|')) {
          const cells = line
            .split('|')
            .map(cell => cell.trim())
            .filter(Boolean)
          if (cells.length > 0) {
            return (
              <div key={index} className='flex border-b border-gray-200 py-2'>
                {cells.map((cell, cellIndex) => (
                  <div key={cellIndex} className='flex-1 px-2'>
                    {cell}
                  </div>
                ))}
              </div>
            )
          }
        }

        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**')
          return (
            <p key={index} className='mb-2'>
              {parts.map((part, partIndex) =>
                partIndex % 2 === 1 ? (
                  <strong key={partIndex}>{part}</strong>
                ) : (
                  part
                ),
              )}
            </p>
          )
        }

        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className='h-2' />
        }

        // Regular paragraphs
        return (
          <p key={index} className='mb-2'>
            {line}
          </p>
        )
      })}
    </div>
  )
}
