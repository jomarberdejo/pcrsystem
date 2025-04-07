"use server";

import { v2 as cloudinary } from "cloudinary";
import moment from "moment";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { OperationType } from "@prisma/client";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL!,
    secure: true
});

async function uploadToCloudinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "pcr_documents" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url as string);
            }
        );

        file.arrayBuffer().then((buffer) => {
            uploadStream.end(Buffer.from(buffer));
        });
    });
}

export async function createPCRCaseRecord(formData: FormData) {
    const operationType = formData.get("operationType") as OperationType;
    const date = formData.get("date") as string;
    const typeOfIncident = formData.get("typeOfIncident") as string;
    const placeOfIncident = formData.get("placeOfIncident") as string;
    const receivingFacility = formData.get("receivingFacility") as string;
    const typeOfConduction = formData.get("typeOfConduction") as string;
    const chiefComplaint = formData.get("chiefComplaint") as string;
    const noOfCasualty = formData.get("noOfCasualty") as string;
    const remarks = formData.get("remarks") as string;
    const vehicleUsed = formData.get("vehicleUsed") as string;
    const ambulanceDriverId = formData.get("ambulanceDriver") as string;

    const vehiclesInvolved = formData.getAll("vehiclesInvolved") as string[];
    const ambulanceCrewsId = formData.getAll("ambulanceCrew") as string[];

    const formatTimeField = (fieldName: string): string | null => {
        const value = formData.get(fieldName);
        if (!value) return null;
        return moment(new Date(value as string)).format("hh:mm A");
    };

    const timeCalled = formatTimeField("timeCalled");
    const timeDispatched = formatTimeField("timeDispatched");
    const timeAtScene = formatTimeField("timeAtScene");
    const timeTransport = formatTimeField("timeTransport");
    const timeEndorsed = formatTimeField("timeEndorsed");
    const timeArrivedAt = formatTimeField("timeArrivedAt");

    const documentationFiles = formData.getAll("documentation") as File[];
    const documentation: string[] = [];

    for (const file of documentationFiles) {
        const uploadedUrl = await uploadToCloudinary(file);
        documentation.push(uploadedUrl);
    }

    await prisma.record.create({
        data: {
            operationType: operationType || "",
            date: new Date(date),
            typeOfIncident,
            placeOfIncident,
            receivingFacility,
            typeOfConduction,
            chiefComplaint,
            noOfCasualty,
            remarks,
            vehicleUsed,
            ambulanceDriver: {
                connect: { id: ambulanceDriverId },
            },
            vehiclesInvolved: vehiclesInvolved.join(", "),
            ambulanceCrews: {
                create: ambulanceCrewsId.map((crewId: string) => ({
                    crew: { connect: { id: crewId } },
                })),
            },
            documentation,
            timeCalled: timeCalled || "",
            timeDispatched: timeDispatched || "",
            timeAtScene: timeAtScene || "",
            timeTransport: timeTransport || "",
            timeEndorsed: timeEndorsed || "",
            timeArrivedAt: timeArrivedAt || "",
        },
    });

    revalidatePath("/records");

    return { success: true };
}
