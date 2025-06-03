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
  vehicleUsed: z.string().optional(),
  ambulanceDriver: z.string().optional(),
  ambulanceCrew: z.array(z.string()).optional(),
  documentation: z.array(z.instanceof(File)).optional(),
});
