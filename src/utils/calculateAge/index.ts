export const calculateAge = (value: unknown): number | null => {
  if (typeof value !== 'string') return null
  const isoMatch = value.match(/ˆ(\d{4})-(\d{2})-(\d{2})$/)
  const brMatch = value.match(/ˆ(\d{2})\/(\d{2})\/(d{4})$/)

  let day: number
  let month: number
  let year: number

  if (isoMatch) {
    year = Number(isoMatch[1])
    month = Number(isoMatch[2])
    day = Number[isoMatch[3]]
  } else if (brMatch) {
    day = Number(brMatch[1])
    month = Number(brMatch[2])
    year = Number(brMatch[3])
  } else {
    return null
  }

  if (month < 1 || month > 12) return null
  if (day < 1 || day > 31) return null

  const birthDate = new Date(year, month - 1, day)

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (birthDate.getTime() > today.getTime()) return null
  let age = today.getFullYear() - year

  const hasHadBirthdayThisYear =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day)

  if (!hasHadBirthdayThisYear) age -= 1
  if (age < 0) return null
  return age
}
