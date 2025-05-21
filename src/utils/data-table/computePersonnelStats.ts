
import { PersonnelType } from "@/types";
import moment from "moment-timezone";
import { DateRange } from "react-day-picker";

export function computePersonnelStats(
    personnelList: PersonnelType[],
    dateRange?: DateRange
): PersonnelType[] {
    if (!dateRange?.from || !dateRange?.to) return personnelList;

    const start = moment(dateRange.from);
    const end = moment(dateRange.to).endOf("day");

    return personnelList.map((personnel) => {
        const filteredRecords = (personnel.records || []).filter((record) => {
            if (!record.date) return false;
            const recordDate = moment.tz(record.date, moment.tz.guess());
            return recordDate.isBetween(start, end, undefined, "[]");
        });

        const totalTransportCases = filteredRecords.filter(
            (r) => r.operationType === "TRANSPORT"
        ).length;

        const totalEmergencyCases = filteredRecords.filter(
            (r) => r.operationType === "EMERGENCY"
        ).length;

        const totalNumberOfOperations = filteredRecords.length;

        return {
            ...personnel,
            totalTransportCases,
            totalEmergencyCases,
            totalNumberOfOperations,
        };
    });
}
