"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PCRReportType } from "@/types";
import PCRClient from "@/components/main/pcr-client";

const fetcher = (url: string): Promise<PCRReportType[]> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch ambulance pcr data");
    return res.json();
  });

const PCRCases = () => {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pcr`,
    fetcher,
    {
      refreshInterval: 60000, // revalidate every 60s
    }
  );

  if (error) return <p className="text-red-500">Failed to fetch data</p>;
  if (isLoading || !data) return <p>Loading PCR data...</p>;

  const sortedData = data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mx-auto overflow-x-hidden py-4">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>PCR Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <PCRClient pcrData={sortedData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PCRCases;
