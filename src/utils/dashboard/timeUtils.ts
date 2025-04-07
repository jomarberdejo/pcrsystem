import moment from "moment";

/**
 * Computes the time difference in minutes between two times.
 */
export function computeTimeDiffInMinutes(startTime: string, endTime: string): number {
  const format = "h:mm A";
  const start = moment(startTime, format);
  const end = moment(endTime, format);
  if (end.isBefore(start)) {
    end.add(1, "day");
  }
  return end.diff(start, "minutes");
}

/**
 * Converts total minutes into a formatted string (e.g., "2 hours 15 mins").
 */
export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hours ${minutes} mins`;
  }
  return `${totalMinutes} mins`;
}

/**
 * Computes the average time difference between two fields across all records and formats it.
 */
export function computeAverageDiff(
  data: any[],
  startField: string,
  endField: string,
  operationType?: string
): string {
  const filteredData = operationType
    ? data.filter((record) => record.operationType === operationType)
    : data;

  const diffs = filteredData
    .map((record) => computeTimeDiffInMinutes(record[startField], record[endField]))
    .filter((diff) => diff >= 0);

  if (diffs.length === 0) return "0 mins";

  const avg = diffs.reduce((acc, val) => acc + val, 0) / diffs.length;
  return formatMinutes(Math.round(avg));
}
