export function formatDateTime(unixTime: string): string {
  return new Date(unixTime).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
