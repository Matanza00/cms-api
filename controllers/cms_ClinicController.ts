import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import queryResources from "../utils/QueryResources";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ClinicController {
  static createOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doc = await prisma.clinic.create({
        data: { ...req.body },
      });

      if (!doc) {
        return next(new ErrorHandler("Unable to Add Clinic", 400));
      }

      res.status(201).json({
        status: "success",
        message: "Clinic Created Successfully",
        data: doc,
      });
    }
  );

  static getAll = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { page, limit, sortBy, sortType, search, keys, ...dynamicFilters } =
        req.query;

      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 100;
      const sortingField = sortBy as keyof typeof prisma.clinic;
      const sortingOrder = (sortType as "asc" | "desc") || "desc";

      const keysArray = keys ? (keys as string).split(",") : [];

      const filter: any = {};

      for (const [key, value] of Object.entries(dynamicFilters)) {
        if (typeof value === "string") {
          filter[key] = value;
        }
      }

      if (search) {
        filter.OR = [
          { name: { contains: search as string } },
          { address: { contains: search as string } },
        ];
      }

      const totalResults = await prisma.clinic.count({ where: filter });

      const doc = await queryResources(prisma.clinic, {
        filter,
        keys: keysArray,
        options: {
          page: pageNumber,
          limit: pageSize,
          sortBy: sortingField as string,
          sortType: sortingOrder,
        },
      });

      res.status(200).json({
        status: "success",
        results: totalResults,
        data: doc,
      });
    }
  );

  static getOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await prisma.clinic.findUnique({
        where: { id: parseInt(id) },
      });

      if (!doc) {
        return next(
          new ErrorHandler("Clinic with this ID does not exist", 404)
        );
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  );

  static updateOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await prisma.clinic.update({
        where: { id: parseInt(id) },
        data: { ...req.body },
      });

      if (!doc) {
        return next(new ErrorHandler("Clinic not found with this ID", 404));
      }

      res.status(200).json({
        status: "success",
        message: "Clinic Updated Successfully",
        data: doc,
      });
    }
  );

  static deleteOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const deleted = await prisma.clinic.delete({
        where: { id: parseInt(id) },
      });

      if (!deleted) {
        return next(new ErrorHandler("Clinic not found with this ID", 404));
      }

      res.status(200).json({
        status: "success",
        message: "Clinic Deleted Successfully",
        data: null,
      });
    }
  );

  static softDelete = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const softDeleted = await prisma.clinic.update({
        where: { id: parseInt(id) },
        data: { deleted_at: new Date() },
      });

      if (!softDeleted) {
        return next(new ErrorHandler("Clinic not found with this ID", 404));
      }

      return res.status(200).json({
        status: "success",
        message: "Clinic Soft Deleted Successfully",
        data: null,
      });
    }
  );
}

export default ClinicController;
