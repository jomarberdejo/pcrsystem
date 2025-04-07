"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StaffType } from "@/types";
import { DriverClient } from "@/components/main/driver-client";

const fetcher = (url: string): Promise<StaffType[]> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch ambulance drivers data");
    return res.json();
  });

export default function DriverPage() {
  const {
    data: ambulanceDriverData,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/drivers`, fetcher, {
    refreshInterval: 60000, // revalidate every 60 seconds
  });

  if (error) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  if (isLoading || !ambulanceDriverData) {
    return <p>Loading ambulance driver data...</p>;
  }

  return (
    <div className="w-full overflow-x-hidden py-4">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>MDRRMO Ambulance Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverClient ambulanceDriverData={ambulanceDriverData} />
        </CardContent>
      </Card>
    </div>
  );
}
