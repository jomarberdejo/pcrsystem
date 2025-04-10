import { Team } from "@prisma/client";
import { type LucideIcon } from "lucide-react"

export type NavItemsType = {
  title: string;
  url: string;
  icon: LucideIcon;
}

export type PCRReportType = {
  id: number;
  operationType: "TRANSPORT" | "EMERGENCY";
  date: string;
  timeCalled: string;
  timeDispatched: string;
  timeAtScene: string;
  timeTransport: string;
  timeEndorsed: string;
  timeArrivedAt: string;
  typeOfIncident: string;
  placeOfIncident: string;
  receivingFacility: string;
  typeOfConduction: string;
  vehiclesInvolved: string;
  chiefComplaint: string;
  noOfCasualty: number;
  remarks: string;
  vehicleUsed: string;
  ambulanceDriver: string;
  ambulanceCrews: string;
  computationCallToOpcen: string;
  computationERTDispatch: string;
  documentation: string[];
}

export interface PersonnelType {
  id: string;
  name: string;
  team: Team;
  totalTransportCases: number;
  totalEmergencyCases: number;
  totalNumberOfOperations: number;
  records: {
    date: string;
    operationType: "EMERGENCY" | "TRANSPORT";
  }[];
}



export type StaffFormPropType = {
  children: React.ReactNode;
  type: "CREW" | "DRIVER";
  onRegister: (type: "CREW" | "DRIVER", name: string, team: string) => void;
};