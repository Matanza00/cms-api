import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RoleController {
   // Create role method
   static createRole = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { roleName, companyId, rolePermissions } = req.body;
  
      // Validate required fields
      if (!roleName || !companyId || !rolePermissions || !Array.isArray(rolePermissions)) {
        return next(new ErrorHandler("Missing required fields or invalid permissions format.", 400));
      }
  
      try {
        // Fetch module IDs based on module names
        const permissionsWithIds = await Promise.all(
          rolePermissions.map(async (perm: any) => {
            const module = await prisma.module.findUnique({ where: { name: perm.moduleName } });
            if (!module) {
              throw new Error(`Module with name "${perm.moduleName}" does not exist.`);
            }
  
            return {
              moduleId: module.id,
              list: perm.list || false,
              write: perm.write || false,
              delete: perm.delete || false,
              update: perm.update || false,
              read: perm.read || false,
            };
          })
        );
  
        console.log("Creating the new role...");
        const newRole = await prisma.role.create({
          data: {
            roleName,
            companyId,
            rolePermissions: {
              create: permissionsWithIds,
            },
          },
        });
  
        res.status(201).json({
          status: "success",
          message: "Role created successfully",
          data: newRole,
        });
      } catch (err: any) {
        console.error("Error creating role:", err.message || err);
        return next(
          new ErrorHandler(
            `Something went wrong. Please try again. ${err.message || err}`,
            500
          )
        );
      }
    }
  );
  
  
  

  static getAllRolesAndPermissions = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const excludedModuleNames = [
        "company",
        "fieldpermission",
        "module",
        "rolemodulepermission",
      ];
      const { companyId } = req.params;

      const rolesWithPermissions = await global.__db.role.findMany({
        where: { companyId: parseInt(companyId), deleted_at: null },
        select: {
          id: true,
          roleName: true,
          rolePermissions: {
            where: {
              module: {
                NOT: {
                  name: {
                    in: excludedModuleNames,
                  },
                },
              },
            },
            select: {
              id: true,
              module: {
                select: {
                  id: true,
                  name: true,
                },
              },

              list: true,
              write: true,
              delete: true,
              update: true,
              read: true,
            },
          },
        },
      });

      // //@ts-ignore
      // const groupedByRoleAndModule = rolesWithPermissions.reduce(
      //   (acc, role) => {
      //     //@ts-ignore

      //     if (!acc[role.roleName]) {
      //       //@ts-ignore

      //       acc[role.roleName] = {};
      //     }

      //     console.log(role.rolePermissions.map((e) => e));
      //     role.rolePermissions.forEach((e) => {
      //       const moduleName = e.module.name;
      //       //@ts-ignore

      //       if (!acc[role.roleName][moduleName]) {
      //         //@ts-ignore

      //         acc[role.roleName][moduleName] = {
      //           rolePermissions: [],
      //         };
      //       }
      //       //@ts-ignore

      //       acc[role.roleName][moduleName].rolePermissions.push({
      //         list: e.list,
      //         write: e.write,
      //         read: e.read,
      //         update: e.update,
      //         delete: e.delete,
      //       });
      //     });

      //     return acc;
      //   },
      //   {}
      // );

      // console.log(rolesWithPermissions);

      res.status(200).json({
        status: "success",
        data: rolesWithPermissions,
      });
    }
  );

  static updateRolePermissions = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { roleId } = req.params;
      const { roleName, rolePermissions } = req.body;
      // console.log(roleId);
      // console.log(roleName);
      // console.log(rolePermissions);
      // Update the role name if provided
      // if (roleName) {
      //   await global.__db.role.update({
      //     where: { id: parseInt(roleId) },
      //     data: { roleName },
      //   });
      // }

      if (rolePermissions) {
        await global.__db.role.update({
          where: { id: parseInt(roleId) },
          data: {
            rolePermissions: {
              updateMany: rolePermissions.map((permission: any) => ({
                where: { id: permission.id },
                data: {
                  list: permission.list,
                  write: permission.write,
                  delete: permission.delete,
                  update: permission.update,
                  read: permission.read,
                },
              })),
            },
          },
        });
      }

      res.status(200).json({
        status: "success",
        message: "Role permissions updated successfully.",
      });
    }
  );

  static getAllRoles = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { companyId } = req.params;

      const doc = await global.__db.role.findMany({
        where: { companyId: parseInt(companyId), deleted_at: null },
      });

      res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  );
}

export default RoleController;

// import { Prisma, PrismaClient } from '@prisma/client';
// import { Request, Response, NextFunction } from 'express';
// import catchAsync from '../utils/catchAsync';
// import ErrorHandler from '../utils/ErrorHandler';

// const prisma = new PrismaClient();

// const softDelete = (Model: keyof PrismaClient) =>
//   catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const doc = await prisma[Model].update({
//       where: { id: parseInt(req.params.id) },
//       data: { deleted_at: new Date() }, // Assuming 'deleted_at' field for soft delete
//     });

//     if (!doc) {
//       return next(new ErrorHandler('No document found with that ID', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: doc,
//     });
//   });

// export default softDelete;
