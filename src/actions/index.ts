"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { OperationType } from "@prisma/client";
import { formatTimeInManila } from "@/lib/utils";
import { PCRCaseRecordUpdateData } from "@/types";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL!,
    secure: true,
});

async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "pcr_documents" },
            (error, result) => {
                if (error) reject(error);
                else resolve({ url: result!.secure_url, publicId: result!.public_id });
            }
        );
        file.arrayBuffer().then((buffer) => {
            uploadStream.end(Buffer.from(buffer));
        });
    });
}

const deleteFromCloudinary = (public_id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, (err, res) => {
            if (err) reject(err);
            else resolve();
        })
    })
}

export async function createPCRCaseRecord(formData: FormData) {
    const operationType = formData.get("operationType") as OperationType;
    const date = new Date(formData.get("date") as string);

    const chiefComplaint = formData.get("chiefComplaint") as string;
    const noOfCasualty = formData.get("noOfCasualty") as string;
    const remarks = formData.get("remarks") as string;
    const vehicleUsed = formData.get("vehicleUsed") as string;

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
            ...(ambulanceCrewsId.length > 0 && {
                ambulanceCrews: {
                    create: ambulanceCrewsId.map((id: string) => ({
                        crew: { connect: { id } },
                    })),
                },
            }),
        },
    });

    revalidatePath("/records");

    return { success: true };
}




export async function updatePCRCaseRecord(id: string, formData: FormData) {
    // console.log("FORM VALUES UPDATE:");
    // formData.forEach((value, key) => {
    //     console.log(`${key}: ${value}`);
    // });
    const getTime = (field: string): string | null => {
        const value = formData.get(field);
        return value ? formatTimeInManila(value as string) : null;
    };

    const updateData: PCRCaseRecordUpdateData = {};

    if (formData.has("operationType")) {
        updateData.operationType = formData.get("operationType") as OperationType;
    }
    if (formData.has("date")) {
        updateData.date = new Date(formData.get("date") as string);
    }
    if (formData.has("chiefComplaint")) {
        updateData.chiefComplaint = formData.get("chiefComplaint") as string;
    }
    if (formData.has("noOfCasualty")) {
        updateData.noOfCasualty = formData.get("noOfCasualty") as string;
    }
    if (formData.has("remarks")) {
        updateData.remarks = formData.get("remarks") as string;
    }
    if (formData.has("vehicleUsed")) {
        updateData.vehicleUsed = formData.get("vehicleUsed") as string;
    }
    if (formData.has("typeOfIncident")) {
        updateData.typeOfIncident = formData.get("typeOfIncident") as string | null;
    }
    if (formData.has("placeOfIncident")) {
        updateData.placeOfIncident = formData.get("placeOfIncident") as string | null;
    }
    if (formData.has("receivingFacility")) {
        updateData.receivingFacility = formData.get("receivingFacility") as string | null;
    }
    if (formData.has("typeOfConduction")) {
        updateData.typeOfConduction = formData.get("typeOfConduction") as string | null;
    }
    if (formData.has("ambulanceDriver")) {
        updateData.ambulanceDriverId = formData.get("ambulanceDriver") as string | null;
    }
    if (formData.has("vehiclesInvolved")) {
        const vehiclesInvolved = formData.getAll("vehiclesInvolved") as string[];
        updateData.vehiclesInvolved = vehiclesInvolved.length
            ? vehiclesInvolved.join(", ")
            : "None";
    }

    updateData.timeCalled = getTime("timeCalled");
    updateData.timeDispatched = getTime("timeDispatched");
    updateData.timeAtScene = getTime("timeAtScene");
    updateData.timeTransport = getTime("timeTransport");
    updateData.timeEndorsed = getTime("timeEndorsed");
    updateData.timeArrivedAt = getTime("timeArrivedAt");

    const documentationFiles = formData.getAll("documentation") as File[];
    if (documentationFiles.length > 0) {
        const existingRecord = await prisma.record.findUnique({
            where: { id },
            select: { documentation: true },
        });

        if (existingRecord?.documentation) {
            const oldDocs = existingRecord.documentation as Array<{ url: string; publicId: string }>;
            await Promise.all(oldDocs.map(doc => deleteFromCloudinary(doc.publicId)));
        }

        const docUpload = await Promise.all(documentationFiles.map(uploadToCloudinary));
        updateData.documentation = docUpload;

    }

    //SET TO NULL WHEN NO AMBULANCE CREW IN UPDATE

    if (Object.keys(updateData).length > 0) {
        await prisma.record.update({
            where: { id },
            data: updateData,
        });
    }

    if (formData.has("ambulanceCrew")) {
        const ambulanceCrewIds = formData.getAll("ambulanceCrew") as string[];

        await prisma.recordCrew.deleteMany({
            where: { recordId: id },
        });

        if (ambulanceCrewIds.length > 0) {
            const newCrews = ambulanceCrewIds.map((crewId: string) => ({
                recordId: id,
                crewId,
            }));

            await prisma.recordCrew.createMany({
                data: newCrews,
                skipDuplicates: true,
            });
        }
    }

    return { success: true };
}



