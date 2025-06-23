import Link from 'next/link'

export default ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  return (
    <Link
      href={href}
      className='text-pr leading-3 hover:underline inline-flex items-center justify-between'
    >
      {children}
    </Link>
  )
}
