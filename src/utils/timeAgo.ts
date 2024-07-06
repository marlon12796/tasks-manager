/**
 * Converts a given date to a human-readable relative time string.
 *
 * @param {Date} date - The date to be converted.
 * @returns {string} A string representing the relative time using `Intl` format (e.g., "2 days ago").
 */
export const timeAgo = (dateAs: Date, lang = navigator.language || 'en-US'): string => {
  const now = new Date()
  const date = new Date(dateAs)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })

  const formatRelativeTime = (value: number, unit: Intl.RelativeTimeFormatUnit): string => {
    return rtf.format(value, unit)
  }

  if (diffInSeconds < 60) return formatRelativeTime(-diffInSeconds, 'second')

  if (diffInSeconds < 3600) return formatRelativeTime(-Math.floor(diffInSeconds / 60), 'minute')

  if (diffInSeconds < 86400) return formatRelativeTime(-Math.floor(diffInSeconds / 3600), 'hour')

  return formatRelativeTime(-Math.floor(diffInSeconds / 86400), 'day')
}
