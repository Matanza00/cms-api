import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addModules() {
  const modules = [
    { name: "Users", tableName: "users" },
    { name: "Managers", tableName: "managers" },
    { name: "Doctors", tableName: "doctors" },
    { name: "Typists", tableName: "typists" },
    { name: "Settings", tableName: "settings" },
    // Add other necessary modules here
  ];

  try {
    for (const module of modules) {
      const existingModule = await prisma.module.findUnique({
        where: { name: module.name },
      });

      if (!existingModule) {
        await prisma.module.createMany({
          data: module,
        });
        console.log(`Module ${module.name} added successfully.`);
      } else {
        console.log(`Module ${module.name} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error adding modules:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addModules();
