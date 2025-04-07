"use client";

import useSWR from "swr";
import { StaffType } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CrewClient } from "@/components/main/crew-client";

const fetcher = (url: string): Promise<StaffType[]> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch ambulance crew data");
    return res.json();
  });

export default function CrewPage() {
  const {
    data: ambulanceCrewData,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/crews`, fetcher, {
    refreshInterval: 60000, // Optional: auto-refresh every 60s
  });

  if (error) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  if (isLoading || !ambulanceCrewData) {
    return <p>Loading ambulance crew data...</p>;
  }

  return (
    <div className="w-full mx-auto overflow-x-hidden py-4">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>MDRRMO Ambulance Crews</CardTitle>
        </CardHeader>
        <CardContent>
          <CrewClient ambulanceCrewData={ambulanceCrewData} />
        </CardContent>
      </Card>
    </div>
  );
}
