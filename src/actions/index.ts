"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { OperationType } from "@prisma/client";
import { formatTimeInManila } from "@/lib/utils";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL!,
    secure: true,
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
    const date = new Date(formData.get("date") as string);

    // Required fields
    const chiefComplaint = formData.get("chiefComplaint") as string;
    const noOfCasualty = formData.get("noOfCasualty") as string;
    const remarks = formData.get("remarks") as string;
    const vehicleUsed = formData.get("vehicleUsed") as string;

    // Optional fields
    const typeOfIncident = formData.get("typeOfIncident") as string | null;
    const placeOfIncident = formData.get("placeOfIncident") as string | null;
    const receivingFacility = formData.get("receivingFacility") as string | null;
    const typeOfConduction = formData.get("typeOfConduction") as string | null;
    const ambulanceDriverId = formData.get("ambulanceDriver") as string | null;

    const vehiclesInvolvedArray = formData.getAll("vehiclesInvolved") as string[];
    const vehiclesInvolved = vehiclesInvolvedArray.length
        ? vehiclesInvolvedArray.join(", ")
        : "None";

    const ambulanceCrewsId = formData.getAll("ambulanceCrew") as string[];

    const getTime = (field: string): string | null => {
        const value = formData.get(field);
        return value ? formatTimeInManila(value as string) : null;
    };

    const timeCalled = getTime("timeCalled");
    const timeDispatched = getTime("timeDispatched");
    const timeAtScene = getTime("timeAtScene");
    const timeTransport = getTime("timeTransport");
    const timeEndorsed = getTime("timeEndorsed");
    const timeArrivedAt = getTime("timeArrivedAt");

    const documentationFiles = formData.getAll("documentation") as File[];
    const documentation =
        documentationFiles.length > 0
            ? await Promise.all(documentationFiles.map(uploadToCloudinary))
            : [];

    await prisma.record.create({
        data: {
            operationType,
            date,
            chiefComplaint,
            noOfCasualty,
            remarks,
            vehicleUsed,
            typeOfIncident: typeOfIncident || null,
            placeOfIncident: placeOfIncident || null,
            receivingFacility: receivingFacility || null,
            typeOfConduction: typeOfConduction || null,
            ambulanceDriverId: ambulanceDriverId || null,
            vehiclesInvolved,
            timeCalled,
            timeDispatched,
            timeAtScene,
            timeTransport,
            timeEndorsed,
            timeArrivedAt,
            documentation: documentation.length > 0 ? documentation : undefined,
            ambulanceCrews: {
                create: ambulanceCrewsId.map((id: string) => ({
                    crew: { connect: { id } },
                })),
            },
        },
    });

    revalidatePath("/records");

    return { success: true };
}
