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

    const timeCalled = formatTimeInManila(formData.get("timeCalled") as string);
    const timeDispatched = formatTimeInManila(formData.get("timeDispatched") as string);
    const timeAtScene = formatTimeInManila(formData.get("timeAtScene") as string);
    const timeTransport = formatTimeInManila(formData.get("timeTransport") as string);
    const timeEndorsed = formatTimeInManila(formData.get("timeEndorsed") as string);
    const timeArrivedAt = formatTimeInManila(formData.get("timeArrivedAt") as string);

    const documentationFiles = formData.getAll("documentation") as File[];

    const documentation = await Promise.all(
        documentationFiles.map(uploadToCloudinary)
    );


    await prisma.record.create({
        data: {
            operationType: operationType || "",
            date,
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
            ...(vehiclesInvolved.length > 0 && {
                vehiclesInvolved: vehiclesInvolved.join(", "),
            }),
            ambulanceCrews: {
                create: ambulanceCrewsId.map((crewId: string) => ({
                    crew: { connect: { id: crewId } },
                })),
            },
            documentation,
            timeCalled,
            timeDispatched,
            timeAtScene,
            timeTransport,
            timeEndorsed,
            timeArrivedAt,
        },
    });

    revalidatePath("/records");

    return { success: true };
}
