export function isNewPost(createdAt: string): boolean {
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)
  return new Date(createdAt) > twoWeeksAgo
}

export function isUpdatedPost(createdAt: string, updatedAt: string): boolean {
  const today = new Date()
  const twoWeeksAgo = new Date(today)
  twoWeeksAgo.setDate(today.getDate() - 14)
  return new Date(updatedAt) > twoWeeksAgo && !isNewPost(createdAt)
}
