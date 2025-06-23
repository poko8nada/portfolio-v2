import { Nunito } from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'] })

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className={`text-2xl mt-2 mb-10 p-2 ${nunito.className}`}>
      {children}
    </h2>
  )
}
