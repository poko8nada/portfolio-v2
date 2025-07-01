export default ({
  children,
  id,
}: { children: React.ReactNode; id?: string }) => {
  return (
    <section
      id={id}
      className='flex flex-col justify-center items-center p-4 mt-2 mb-16 min-h-[160px]'
    >
      {children}
    </section>
  )
}
