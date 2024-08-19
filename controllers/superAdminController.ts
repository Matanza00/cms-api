import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import mysqldump from "mysqldump";
// import { parseDatabaseUrl } from '../mybackup';
import { URL } from "url";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

import crypto from "crypto";
import Email from "../utils/Email";

require("dotenv").config();

class SuperAdminController {
  static CreateCompany = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await global.__db.$transaction(async (tx: any) => {
        const { email, name, address, logo } = req.body;

        const emailParts = email.split("@");
        const domain = emailParts[emailParts.length - 1];

        const existingCompany = await tx.company.findFirst({
          where: {
            email: {
              endsWith: domain,
            },
          },
        });

        // if (existingCompany) {
        //   return next(
        //     new ErrorHandler(
        //       `A company with the domain ${domain} already exists`,
        //       400
        //     )
        //   );
        // }

        const doc = await tx.company.create({
          data: { email, name, address, logo },
        });
        if (!doc) {
          return next(new ErrorHandler(`Unable to Add Data`, 400));
        }

        const adminRole = await tx.role.create({
          data: { roleName: "companyAdmin", companyId: doc.id },
        });
        const regionalAdminRole = await tx.role.create({
          data: { roleName: "regionalAdmin", companyId: doc.id },
        });
        const viewerRole = await tx.role.create({
          data: { roleName: "viewer", companyId: doc.id },
        });

        if (!adminRole || !regionalAdminRole || !viewerRole) {
          return next(new ErrorHandler(`Unable to Assign Role`, 400));
        }
        const allModules = await tx.module.findMany({});
        // Admin
        for (let i = 0; i < allModules.length; i++) {
          const addingRoleModules = await tx.roleModulePermission.create({
            data: {
              roleId: adminRole.id,
              moduleId: allModules[i].id,
              list: true,
              update: true,
              write: true,
              read: true,
              delete: true,
            },
          });
        }

        // RegionalAdmin
        for (let i = 0; i < allModules.length; i++) {
          const addingRoleModules = await tx.roleModulePermission.create({
            data: {
              roleId: regionalAdminRole.id,
              moduleId: allModules[i].id,
              list: true,
              update: true,
              write: true,
              read: true,
              delete: false,
            },
          });
        }

        // Viewer
        for (let i = 0; i < allModules.length; i++) {
          const addingRoleModules = await tx.roleModulePermission.create({
            data: {
              roleId: viewerRole.id,
              moduleId: allModules[i].id,
              list: true,
              update: false,
              write: false,
              read: true,
              delete: false,
            },
          });
        }

        res.status(201).json({
          status: "success",
          data: doc,
        });
      });
    }
  );

  static AddRoleToCompany = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await global.__db.$transaction(async (tx: any) => {
        const { companyId, roleName } = req.body;

        // Find the company
        const company = await tx.company.findUnique({
          where: {
            id: companyId,
          },
        });

        if (!company) {
          return next(
            new ErrorHandler(`Company with id ${companyId} not found`, 404)
          );
        }

        // Create the role
        const role = await tx.role.create({
          data: { roleName, companyId: company.id },
        });

        if (!role) {
          return next(new ErrorHandler(`Unable to create role`, 400));
        }

        // Get all modules
        const allModules = await tx.module.findMany({});

        // Assign permissions as companyAdmin to the new role
        for (let i = 0; i < allModules.length; i++) {
          const addingRoleModules = await tx.roleModulePermission.create({
            data: {
              roleId: role.id,
              moduleId: allModules[i].id,
              list: true,
              update: true,
              write: true,
              read: true,
              delete: true,
            },
          });
        }

        res.status(201).json({
          status: "success",
          data: role,
        });
      });
    }
  );

  static addRolePermissionstoRoleId = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { roleId } = req.body;
      const allModules = await global.__db.module.findMany({});
      for (let i = 0; i < allModules.length; i++) {
        const doc = await global.__db.roleModulePermission.create({
          data: {
            roleId: parseInt(roleId),
            moduleId: allModules[i].id,
            list: true,
            update: true,
            write: true,
            read: true,
            delete: true,
          },
        });
      }

      return res.status(201).json({
        status: "success",
        data: "Permissions Updated",
      });
    }
  );

  static CreateCompanyAdmin = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const tx = global.__db;
      const { email, username, companyId } = req.body; // Remove phone from here
      const userExist = await tx.cms_Users.findFirst({
        where: { email: email },
      });

      if (userExist) {
        return next(new ErrorHandler(`Company admin already exists`, 400));
      }

      const adminRole = await tx.role.findFirst({
        where: { companyId: parseInt(companyId), roleName: "companyAdmin" },
      });

      if (!adminRole) {
        return next(new ErrorHandler(`Unable to Assign Role`, 400));
      }

      const token = crypto.randomBytes(32).toString("hex");
      const passwordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const passwordTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

      const doc = await tx.cms_Users.create({
        data: {
          email,
          username,
          companyId: parseInt(companyId),
          isCompanyAdmin: true,
          isActive: true,
          roleId: adminRole.id,
          passwordToken: passwordToken,
          passwordTokenExpire,
        },
      });
      if (!doc) {
        return next(new ErrorHandler(`Unable to Add User`, 400));
      }

      const passwordLink = `http://localhost:5173/set-admin-password/${token}`;
      const message = `Use the following link to set up your password, 
        <br/><br/>
        <strong><a href="${passwordLink}"> ${passwordLink} </a></strong><br/>
        <br/>
      `;

      let _user = {
        email: doc.email || "", // Handle potential null
        username: doc.username || "",
        name: doc.username || "",
      };
      const emailInstance = new Email(_user, message, "Password Reset");
      await emailInstance.sendPasswordSetLink();

      return res.status(201).json({
        status: "success",
        data: "Admin Created Successfully",
      });
    }
  );

  static getAllCompanies = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doc = await global.__db.company.findMany({
        where: { deleted_at: null },
        select: {
          id: true,
          email: true,
          name: true,
          address: true,
          logo: true,
          noOfUsers: true,
          subscriptionPlanId: true,
          isActive: true,
          created_at: true,
        },
      });

      return res.status(201).json({
        status: "success",
        data: doc,
      });
    }
  );

  static getOneCompany = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await global.__db.company.findFirst({
        where: { id: parseInt(id) },
        select: {
          id: true,
          email: true,
          name: true,
          address: true,
          logo: true,
          noOfUsers: true,
          subscriptionPlanId: true,
          isActive: true,
          created_at: true,
        },
      });

      return res.status(201).json({
        status: "success",
        data: doc,
      });
    }
  );

  static getCompanyAdmin = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const roleName = "companyAdmin";

      const doc = await global.__db.cms_Users.findFirst({
        where: {
          companyId: parseInt(id),
          Role: {
            roleName,
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          // Remove phone from here
        },
      });

      return res.status(201).json({
        status: "success",
        data: doc,
      });
    }
  );

  //   static getDbbackup = AsyncHandler(async (req, res) => {
  //   const confirmation = req.query.confirm;

  //   if (confirmation !== 'true') {
  //     res.status(400).send("Confirmation query parameter is required to proceed.");
  //     return;
  //   }

  //   try {
  //     // Log the operation
  //     console.log("Starting database table drop operation...");

  //     // Create a backup before dropping tables
  //     const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
  //     const dump = await mysqldump({
  //       connection: dbConfig,
  //     });
  //     const sqlDump = dump.dump.schema + "\n" + dump.dump.data;

  //     // Save backup to a file (or any preferred storage)
  //     const fs = require('fs');
  //     const backupFilePath = '../mybackup/backup.sql'; // Specify your backup file path
  //     fs.writeFileSync(backupFilePath, sqlDump);

  //     // Proceed with dropping tables
  //     await prisma.$executeRawUnsafe(`SET foreign_key_checks = 0`);
  //     const tables = await prisma.$queryRaw`SHOW TABLES`;

  //     for (const table of tables) {
  //       const tableName = Object.values(table)[0];
  //       await prisma.$executeRawUnsafe(`DROP TABLE \`${tableName}\``);
  //     }

  //     await prisma.$executeRawUnsafe(`SET foreign_key_checks = 1`);
  //     res.send("Database Backup Done");

  //     // Log the successful operation
  //     console.log("Database table drop operation completed successfully.");
  //   } catch (error) {
  //     console.error("Error :", error);
  //     res.status(500).send("Failed to drop the tables");
  //   }
  // });
}

async function findAllTablesAndFields() {
  try {
    const schemaName = "fms"; // Adjust the schema name as needed

    // Fetch all table names within the specified schema
    const tables: any = await global.__db.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ${schemaName} 
      AND TABLE_TYPE = 'BASE TABLE'`;

    // Initialize an array to hold our final results
    let tablesWithFields: any = [];

    // For each table, fetch the column details
    for (let table of tables) {
      const fields = await global.__db.$queryRaw`
        SELECT COLUMN_NAME
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = ${schemaName} 
        AND TABLE_NAME = ${table.TABLE_NAME}
        `;

      // Append the table and its fields to our results array
      tablesWithFields.push({
        tableName: table.TABLE_NAME,
        fields,
      });
    }

    return tablesWithFields;
  } catch (error) {
    console.error("Error fetching tables and fields:", error);
    throw error; // Rethrow or handle as needed
  }
}

export default SuperAdminController;
