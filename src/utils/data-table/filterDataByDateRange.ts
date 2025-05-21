import moment from "moment-timezone";
import { DateRange } from "react-day-picker";

export function filterDataByDateRange<T extends object>(
    data: T[],
    dateRange?: DateRange,
    options?: { mode?: "flat" | "nested" }
): T[] {
    if (!dateRange?.from || !dateRange?.to) return data;

    const start = moment(dateRange.from);
    const end = moment(dateRange.to).endOf("day");
    const mode = options?.mode ?? "nested";

    if (mode === "flat") {
        return data.filter((item: any) => {
            if (!item.date) return true;
            const itemDate = moment.tz(item.date, moment.tz.guess());
            return itemDate.isBetween(start, end, undefined, "[]");
        });
    }

    return data
        .map((item: any) => {
            const filteredRecords = (item.records || []).filter((record: any) => {
                if (!record.date) return false;
                const recordDate = moment.tz(record.date, moment.tz.guess());
                return recordDate.isBetween(start, end, undefined, "[]");
            });

            return {
                ...item,
                records: filteredRecords,
            };
        })
        .filter((item: any) => item.records && item.records.length > 0);
}




