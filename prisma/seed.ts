import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    //create admin
    const admin1 = await prisma.admin.create({
        data: { username: "mdrrmo_admin", password: "!Admin1234" },
    });
    // 🚑 Create Ambulance Drivers

    // const driver1 = await prisma.ambulanceDriver.create({
    //     data: { name: "Bryan Esmero", username: "bryanesmero" },
    // });

    // const driver2 = await prisma.ambulanceDriver.create({
    //     data: { name: "Domingo Quidlat", username: "domingoquidlat" },
    // });

    // // 🏥 Create Ambulance Crews
    // const crew1 = await prisma.ambulanceCrew.create({
    //     data: { name: "Jethro Basallaje", username: "jethrobasallaje" },
    // });

    // const crew2 = await prisma.ambulanceCrew.create({
    //     data: { name: "Edgardo Ace Encio", username: "edgardoencio" },
    // });

    // const crew3 = await prisma.ambulanceCrew.create({
    //     data: { name: "Maria Sherlyn Lauron", username: "mariasherlyn" },
    // });

    // const crew4 = await prisma.ambulanceCrew.create({
    //     data: { name: "Merly Javines", username: "merlyjavines" },
    // });

    // 📋 Create Records with Linked Crews
    // const record1 = await prisma.record.create({
    //     data: {
    //         date: new Date("2025-03-14"),
    //         timeCalled: "2:15 PM",
    //         timeDispatched: "2:20 PM",
    //         timeAtScene: "2:35 PM",
    //         timeTransport: "2:50 PM",
    //         timeEndorsed: "3:10 PM",
    //         timeArrivedAt: "2:35 PM",
    //         typeOfIncident: "Medical Emergency",
    //         placeOfIncident: "Ponong",
    //         receivingFacility: "Carigara District Hospital (CDH)",
    //         typeOfConduction: "Pedestrian/Road Accident to Hospital",
    //         vehiclesInvolved: "Motorcycle vs Sidecar",
    //         chiefComplaint: "Swelling on the right side of the head",
    //         noOfCasualty: "1 Male Patient, 2 Male Patient",
    //         remarks:
    //             "Respondents applied first aid and immediately transported to CDH for further management",
    //         vehicleUsed: "RV2",
    //         documentation: ["http://link.png", "http://link2.png"],
    //         operationType: "EMERGENCY",
    //         ambulanceDriverId: driver1.id,

    //         // Assign crews to this record
    //         ambulanceCrews: {
    //             create: [
    //                 { crew: { connect: { id: crew1.id } } },
    //                 { crew: { connect: { id: crew2.id } } },
    //             ],
    //         },
    //     },
    // });

    // const record2 = await prisma.record.create({
    //     data: {
    //         date: new Date("2024-12-27"),
    //         timeCalled: "12:22 PM",
    //         timeDispatched: "12:21 PM",
    //         timeAtScene: "1:35 PM",
    //         timeTransport: "12:44 PM",
    //         timeEndorsed: "1:16 PM",
    //         timeArrivedAt: "1:35 PM",
    //         typeOfIncident: "Medical Emergency",
    //         placeOfIncident: "West Visoria",
    //         receivingFacility: "Carigara District Hospital (CDH)",
    //         typeOfConduction: "Pedestrian/Road Accident to Hospital",
    //         vehiclesInvolved: "Car vs Motorcycle",
    //         chiefComplaint: "Swelling on the right side of the head",
    //         noOfCasualty: "1 Female Patient",
    //         remarks:
    //             "Respondents applied first aid and immediately transported to CDH for further management",
    //         vehicleUsed: "RV5",
    //         documentation: ["http://link.png", "http://link2.png"],
    //         operationType: "EMERGENCY",
    //         ambulanceDriverId: driver2.id,

    //         // Assign crews to this record
    //         ambulanceCrews: {
    //             create: [
    //                 { crew: { connect: { id: crew3.id } } },
    //                 { crew: { connect: { id: crew4.id } } },
    //             ],
    //         },
    //     },
    // });

    console.log("✅ Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


