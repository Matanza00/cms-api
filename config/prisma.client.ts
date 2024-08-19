import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

// Example query to check if the database is accessible
global.__db.module
  .findMany()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error: any) => {
    console.error("Error connecting to database:", error);
  });
