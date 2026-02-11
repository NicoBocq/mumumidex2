export function formatDateTime(unixTime: string): string {
  return new Date(unixTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}
