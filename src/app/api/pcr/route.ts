import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatDateDisplay } from "@/lib/utils";
import momentPH from "@/lib/moment";
function computeTimeDiff(startTime?: string | null, endTime?: string | null): string {
  if (!startTime || !endTime) return ""; // Return empty if either time is missing

  const format = "h:mm A";
  const start = momentPH(startTime, format);
  const end = momentPH(endTime, format);

  if (end.isBefore(start)) {
    end.add(1, "day");
  }

  const diffInMinutes = end.diff(start, "minutes");

  if (diffInMinutes >= 60) {
    const diffInHours = Math.floor(diffInMinutes / 60);
    const remainingMinutes = diffInMinutes % 60;
    return `${diffInHours} hours ${remainingMinutes} mins`;
  }

  return `${diffInMinutes} mins`;
}


export async function GET() {
  const records = await prisma.record.findMany({
    include: {
      ambulanceDriver: true,
      ambulanceCrews: {
        include: { crew: true },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  const updatedData = records.map((report) => {
    const formattedDate = formatDateDisplay(report.date);
    return {
      ...report,
      date: formattedDate,
      computationCallToOpcen: computeTimeDiff(report.timeCalled, report.timeArrivedAt),
      computationERTDispatch: computeTimeDiff(report.timeDispatched, report.timeArrivedAt),
      ambulanceDriver: report.ambulanceDriver?.name,
      ambulanceCrews: report.ambulanceCrews.map((rc) => rc.crew.name).join(", "),
    };
  });

  return NextResponse.json(updatedData);
}
