export default ({
  thumbnail = '/images/pencil01.svg',
  className = 'w-[60px] h-[60px]',
}: {
  thumbnail?: string
  sizes?: { width: number; height: number }
  className?: string
}) => {
  return <img src={thumbnail} alt={''} className={className} />
}
