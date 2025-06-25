const baseClass =
  'absolute left-2 top-2 inline-flex items-center gap-1 px-2 h-5 text-xs font-normal rounded border'

const LabelNew = () => {
  return (
    <div
      className={`${baseClass} border-pink-400 text-pink-600 bg-transparent`}
    >
      new
    </div>
  )
}
const LabelUpdate = () => {
  return (
    <div
      className={`${baseClass} border-blue-400 text-blue-600 bg-transparent`}
    >
      update
    </div>
  )
}

export { LabelNew, LabelUpdate }
