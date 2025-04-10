"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { PersonnelType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { staffColumns } from "@/components/shared/staff-columns";
import { exportToExcelPersonnel } from "@/utils/pcr-cases/exportToExcelPersonnel";
import useSWR from "swr";
import EditPersonnel from "@/components/shared/edit-personnel-modal";

const fetcher = async (url: string): Promise<PersonnelType[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch ambulance drivers data");
  }
  return res.json();
};

export function DriverClient() {
  const {
    data: ambulanceDriverData,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/drivers`, fetcher, {
    refreshInterval: 60000,
  });

  const [selectedPersonnel, setSelectedPersonnel] =
    useState<PersonnelType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (error) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  if (isLoading || !ambulanceDriverData) {
    return <p>Loading ambulance driver data...</p>;
  }

  const onRegister = async (type: "CREW" | "DRIVER", name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/drivers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) throw new Error("Failed to add new driver");

      const newDriver = await response.json();
      toast.success("Success!", {
        description: `New ambulance driver added: ${newDriver.name}`,
        position: "top-right",
      });
      mutate();
    } catch (error) {
      console.error("Error registering driver:", error);
      toast.error("Failed to add driver.");
    }
  };

  return (
    <>
      <DataTable
        columns={staffColumns({
          setSelectedPersonnel,
          setModalOpen,
        })}
        filterableColumns={["name"]}
        data={ambulanceDriverData}
        onExport={exportToExcelPersonnel}
        exportTitle="AMBULANCE_DRIVERS"
        onRegister={onRegister}
      />
      <EditPersonnel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPersonnel={selectedPersonnel}
        mutate={mutate}
        personnelType="drivers"
      />
    </>
  );
}
