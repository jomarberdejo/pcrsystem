import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DriverClient } from "@/components/main/driver-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driver Personnels",
};
export default function DriverPage() {
  return (
    <div className="w-full overflow-x-hidden py-4">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>MDRRMO Driver Personnels</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverClient />
        </CardContent>
      </Card>
    </div>
  );
}
