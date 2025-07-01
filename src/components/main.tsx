export default (props: { children: React.ReactNode }) => {
  return (
    <main className='bg-bg w-[96%] max-w-[900px] mx-auto border-1 border-bg-2 mt-30'>
      {props.children}
    </main>
  )
}
