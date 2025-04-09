import { PCRFormClient } from "@/components/main/pcr-form-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PCR Form",
};

const PCRFormPage = () => {
  return <PCRFormClient />;
};

export default PCRFormPage;
