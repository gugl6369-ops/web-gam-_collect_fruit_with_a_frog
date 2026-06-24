export const formattedTime = (time: number) => {
  const mins = Math.floor(time / 60)
  const secs = time % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
