"use client";

import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { PersonnelType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { staffColumns } from "@/components/shared/staff-columns";
import { exportToExcelPersonnel } from "@/utils/pcr-cases/exportToExcelPersonnel";
import EditPersonnel from "@/components/shared/edit-personnel-modal";
import { DataTableSkeleton } from "@/components/skeletons/pcr-cases-skeleton";
import { useUser } from "@/context/UserProvider";

const fetcher = async (url: string): Promise<PersonnelType[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch crew personnels data");
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

  const { user, isLoading: userLoading, error: userError } = useUser();
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<PersonnelType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (error) return <p className="text-red-500">Failed to fetch data</p>;
  if (userError)
    return <p className="text-red-500">Failed to fetch user info</p>;
  if (isLoading || !ambulanceCrewData || userLoading)
    return <DataTableSkeleton />;

  console.log("CLIENT RENDERED");

  const onRegister = async (
    type: "CREW" | "DRIVER",
    name: string,
    team: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, team }),
        }
      );

      if (!response.ok) throw new Error("Failed to add new crew");

      const newCrew = await response.json();
      toast.success("Success!", {
        description: `New crew personnel added: ${newCrew.name}`,
        position: "top-right",
      });
      mutate();
    } catch (error) {
      console.error("Error registering crew:", error);
      toast.error("Failed to add crew.");
    }
  };

  return (
    <>
      <DataTable
        columns={staffColumns({
          setSelectedPersonnel,
          setModalOpen,
          currentUserRole: user?.role ?? "REGULAR_ADMIN",
        })}
        filterableColumns={["name", "team"]}
        data={ambulanceCrewData}
        onExport={exportToExcelPersonnel}
        exportTitle="AMBULANCE_CREWS"
        onRegister={onRegister}
        hasDateRange={true}
        currentUserRole={user?.role}
      />
      <EditPersonnel
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPersonnel={selectedPersonnel}
        mutate={mutate}
        personnelType="crews"
      />
    </>
  );
}
