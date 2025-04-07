import { NextResponse } from "next/server";
import moment from "moment-timezone";
import prisma from "@/lib/prisma";

function computeTimeDiff(startTime: string, endTime: string): string {
  const format = "h:mm A";
  const start = moment(startTime, format);
  const end = moment(endTime, format);

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
  });
  console.log(records)
  const updatedData = records.map((report) => {
    const formattedDate = moment
      .tz(report.date, "Asia/Manila")
      .format("YYYY MMMM DD (dddd)");

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
