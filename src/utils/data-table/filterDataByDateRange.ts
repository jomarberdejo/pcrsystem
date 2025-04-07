import moment from "moment-timezone";
import { DateRange } from "react-day-picker";

export interface Dateable {
    date?: string;
}

export function filterDataByDateRange<T extends { date?: string }>(
    data: T[],
    dateRange?: DateRange
): T[] {
    if (!dateRange?.from || !dateRange?.to) return data;

    const start = moment(dateRange.from);
    const end = moment(dateRange.to).endOf("day");

    return data.filter((item) => {
        if (!item.date) return true; // If no date, skip filtering for this item
        const itemDate = moment.tz(item.date, moment.tz.guess());
        return itemDate.isBetween(start, end, undefined, "[]");
    });
}

