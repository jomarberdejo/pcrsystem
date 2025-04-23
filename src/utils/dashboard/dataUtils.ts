import momentPH from "@/lib/moment";

export function getCurrentMonthCases(data: any[]): number {
    const currentMonth = momentPH().month();
    return data.filter(
        (record) => momentPH(record.date, "YYYY MMMM DD (dddd)").month() === currentMonth
    ).length;
}

export function getTopLocation(data: any[]) {
    const locationCount: Record<string, number> = {};
    data.forEach((record) => {
        locationCount[record.placeOfIncident] = (locationCount[record.placeOfIncident] || 0) + 1;
    });

    const topLocation = Object.keys(locationCount).reduce(
        (a, b) => (locationCount[a] > locationCount[b] ? a : b),
        ""
    );

    return { location: topLocation, count: locationCount[topLocation] || 0 };
}


export function getVehicleUsage(data: any[]): Record<string, number> {
    const usage: Record<string, number> = {};
    data.forEach((record) => {
        usage[record.vehicleUsed] = (usage[record.vehicleUsed] || 0) + 1;
    });
    return usage;
}
