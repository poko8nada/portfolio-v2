const baseClass =
  'absolute inline-flex items-center justify-center p-2 h-5 text-xs text-white rounded-md md:start-2 md:top-2 top-1 start-1'
const LabelNew = () => {
  return <div className={`${baseClass} bg-red-600`}>new</div>
}
const LabelUpdate = () => {
  return <div className={`${baseClass} bg-blue-600`}>update</div>
}

export { LabelNew, LabelUpdate }
