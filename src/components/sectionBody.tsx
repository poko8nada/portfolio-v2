export default ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='flex flex-col justify-center items-center p-4 mt-4 mb-16 min-h-[160px]'>
      {children}
    </section>
  )
}
