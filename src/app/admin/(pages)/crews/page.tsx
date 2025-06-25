import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CrewClient } from "@/components/main/crew-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crew Personnels",
};

export default function CrewPage() {
  console.log("SERVER RENDERED");

  return (
    <div className="w-full mx-auto overflow-x-hidden py-4">
      <Card className="border-hidden shadow-none">
        <CardHeader>
          <CardTitle>MDRRMO Crew Personnels</CardTitle>
        </CardHeader>
        <CardContent>
          <CrewClient />
        </CardContent>
      </Card>
    </div>
  );
}
