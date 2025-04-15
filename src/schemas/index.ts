import { z } from "zod";

export const formSchema = z.object({
  operationType: z.string().min(1, "Operation type is required"),
  date: z.date(),
  timeCalled: z.date().optional(),
  timeDispatched: z.date().optional(),
  timeAtScene: z.date().optional(),
  timeTransport: z.date().optional(),
  timeEndorsed: z.date().optional(),
  timeArrivedAt: z.date().optional(),
  typeOfIncident: z.string().optional(),
  placeOfIncident: z.string().optional(),
  receivingFacility: z.string().optional(),
  typeOfConduction: z.string().optional(),
  vehiclesInvolved: z.array(z.string()).optional(),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  noOfCasualty: z.string().min(1, "No. of casualty is required"),
  remarks: z.string().min(1, "Remarks are required"),
  vehicleUsed: z.string().min(1, "Vehicle used is required"),
  ambulanceDriver: z.string().min(1, "Ambulance driver is required"),
  ambulanceCrew: z.array(z.string()).min(1, "At least one ambulance crew member is required"),
  documentation: z.array(z.instanceof(File)).optional(),
});
