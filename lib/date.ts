import dayjs, { Dayjs } from "dayjs"

export function formatServerDateTime(date: string | null) {
  const instancedDate = format(date, "YYYY-MM-DD HH:mm")

  if (!instancedDate) {
    return "Not available"
  }

  return instancedDate
}

export function format(
  date: string | number | Date | Dayjs | null | undefined,
  format?: string
): string | null {
  if (!date) {
    return null
  }

  const instancedDate = dayjs(date)

  if (!instancedDate.isValid()) {
    return null
  }

  return instancedDate.format(format ?? "YYYY-MM-DD")
}
