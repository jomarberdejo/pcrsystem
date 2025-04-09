import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PCRCaseClient } from "@/components/main/pcr-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PCR Cases",
};
const PCRCases = () => {
  return (
    <div className="mx-auto overflow-x-hidden py-4 w-full">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>PCR Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <PCRCaseClient />
        </CardContent>
      </Card>
    </div>
  );
};

export default PCRCases;
