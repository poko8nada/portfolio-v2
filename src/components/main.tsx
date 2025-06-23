export default (props: { children: React.ReactNode }) => {
  return (
    <main className='bg-bg w-[96%] max-w-[900px] mx-auto rounded-xl border-1 border-bg-2 m-4'>
      {props.children}
    </main>
  )
}
