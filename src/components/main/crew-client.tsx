"use client";

import { StaffType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { exportToExcelPersonnel } from "@/utils/pcr-cases/exportToExcelPersonnel";
import { staffColumns } from "@/components/shared/staff-columns";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = async (url: string): Promise<StaffType[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetched ambulance crews data");
  }
  return res.json();
};

export function CrewClient() {
  const {
    data: ambulanceCrewData,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/crews`, fetcher, {
    refreshInterval: 60000,
  });

  if (error) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  if (isLoading || !ambulanceCrewData) {
    return <p>Loading ambulance crew data...</p>;
  }

  const onRegister = async (type: "CREW" | "DRIVER", name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new crew");
      }

      const newCrew = await response.json();
      toast.success("Success!", {
        description: `New ambulance crew added: ${newCrew.name}`,
        position: "top-right",
      });
      mutate();
    } catch (error) {
      console.error("Error registering crew:", error);
      toast.error("Failed to add crew.");
    }
  };

  return (
    <DataTable
      columns={staffColumns}
      filterableColumns={["name"]}
      data={ambulanceCrewData}
      onExport={exportToExcelPersonnel}
      exportTitle="AMBULANCE_CREWS"
      onRegister={onRegister}
    />
  );
}
