import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import GlobalErrors from "./middleware/GlobalErrors";
import ErrorHandler from "./utils/ErrorHandler";
import routes from "./routes";
import "./config/prisma.client";
import "./services/shcedulers";
import { PrismaClient } from '@prisma/client';  // Add this import

const app: Application = express();

// Add the module creation function
const prisma = new PrismaClient();

async function addModules() {
  try {
    await prisma.module.createMany({
      data: [
        { name: "Users", tableName: "users" },
        { name: "Managers", tableName: "managers" },
        { name: "Doctors", tableName: "doctors" },
        { name: "Typists", tableName: "typists" },
        { name: "Settings", tableName: "settings" },
        // Add other necessary modules here
      ],
    });
    console.log("Modules added successfully.");
  } catch (error) {
    console.error('Error adding modules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the module creation function before setting up routes
addModules().then(() => {
  console.log("Modules check complete.");
});

// Logger middleware
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

// Body parsing middleware
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Parsing the cookies
app.use(cookieParser());

// Cors middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

// Project routes
app.use("/api/v1", routes);

// Dummy welcome route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to CMS  Typescript App!");
});

// Request not found middleware
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    new ErrorHandler(`Cant't find route for ${req.originalUrl} this url.`, 404)
  );
});

// Global error middleware
app.use(GlobalErrors);

export default app;
