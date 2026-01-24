// Generate a UUID that works on all browsers including older mobile ones
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const useVoterId = () => {
  const voterId = useCookie('voter_id', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    default: () => generateUUID()
  })

  return voterId
}
