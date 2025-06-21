"use client";

import { DataTable } from "@/components/shared/data-table";
import { columns } from "../shared/audit-log-columns";
import useSWR from "swr";
import { DataTableSkeleton } from "@/components/skeletons/pcr-cases-skeleton";
import { AuditLogType } from "@/types";

const fetcher = async (url: string): Promise<AuditLogType[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch audit logs");
  }
  const data = await res.json();
  return data;
};

export default function AuditLogClient() {
  const {
    data: logs,
    error,
    isLoading,
  } = useSWR("/api/audit-logs", fetcher, {
    refreshInterval: 60000,
  });

  if (error) return <p className="text-red-500">Failed to fetch audit logs.</p>;
  if (isLoading || !logs) return <DataTableSkeleton />;

  return (
    <DataTable
      columns={columns}
      data={logs}
      filterableColumns={["action", "user"]}
      exportTitle="AUDIT_LOGS"
    />
  );
}
