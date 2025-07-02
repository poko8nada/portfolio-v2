import { Nunito } from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'] })

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className={`text-2xl mt-18 mb-4 p-2 ${nunito.className}`}>
      {children}
    </h2>
  )
}
