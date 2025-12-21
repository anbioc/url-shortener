export function FormattedTime(date: Date) {
  try {
const formatted = new Intl.DateTimeFormat('en-US', {
   
    month: '2-digit',
    year:'2-digit',
    hour12: true, // false for 24-hour
  }).format(new Date(date))
  return formatted
  } catch(e) {
    return ""

  }
}