import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuditLogClient from "@/components/main/audit-log-client";

export const metadata: Metadata = {
  title: "Audit Logs",
};

const AuditLogsPage = () => {
  return (
    <div className="w-full mx-auto overflow-x-hidden py-4">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>System Action History</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditLogClient />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
