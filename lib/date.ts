import dayjs from "dayjs"

export function formatServerDateTime(date: string | null) {
  if (!date) {
    return "Not available"
  }

  const instancedDate = dayjs(date)

  if (!instancedDate.isValid()) {
    return "Not available"
  }

  return instancedDate.format("YYYY-MM-DD HH:mm")
}
