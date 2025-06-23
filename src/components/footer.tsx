export default () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className='flex justify-center items-center my-10'>
      <p className='bg-bg px-2 py-1 rounded-md border-1 border-bg-2 text-sm'>
        &copy; {currentYear}{' '}
        <a href='/' className='text-pr hover:underline'>
          PokoHanadaCom
        </a>
      </p>
    </footer>
  )
}
