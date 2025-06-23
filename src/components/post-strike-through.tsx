import React from 'react'

function processText(text: string) {
  let uniqueKey = 0
  return text.split(/(~[^~]+~)/g).map(part => {
    if (part.startsWith('~') && part.endsWith('~')) {
      return <del key={uniqueKey++}>{part.slice(1, -1)}</del>
    }
    return part
  })
}
const StP = ({ children }: { children: React.ReactNode }) => {
  return (
    <p>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return processText(child)
        }
        return child
      })}
    </p>
  )
}

const StH2 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return processText(child)
        }
        return child
      })}
    </h2>
  )
}
const StH3 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return processText(child)
        }
        return child
      })}
    </h3>
  )
}

export { StP, StH2, StH3 }
