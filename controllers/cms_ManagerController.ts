import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import queryResources from "../utils/QueryResources";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ManagerController {
  static createOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const existingManager = await prisma.manager.findUnique({
        where: { employeeId: req.body.employeeId },
      });

      if (existingManager) {
        return next(new ErrorHandler("Manager already exists", 400));
      }

      const doc = await prisma.manager.create({
        data: {
          ...req.body,
          joiningDate: new Date(req.body.joiningDate).toISOString(),
        },
      });

      if (!doc) {
        return next(new ErrorHandler("Unable to Add Manager", 400));
      }

      res.status(201).json({
        status: "success",
        message: "Manager created successfully",
        data: doc,
      });
    }
  );

  static getAllWithoutPagination = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { companyId } = req.params;
      const { search, keys, ...dynamicFilters } = req.query;

      const keysArray = keys ? (keys as string).split(",") : [];

      const filter: any = {
        companyId: parseInt(companyId) as never,
        deleted_at: null as never,
      };

      for (const [key, value] of Object.entries(dynamicFilters)) {
        if (typeof value === "string") {
          filter[key] = value;
        }
      }

      if (search) {
        filter.OR = [
          { employeeId: { contains: search as string } },
          { name: { contains: search as string } },
          // Add more fields as needed for searching
        ];
      }

      console.log("Filter:", filter);

      const totalResults = await prisma.manager.count({
        where: filter,
      });

      const doc = await prisma.manager.findMany({
        where: filter,
        select: keysArray.length
          ? Object.fromEntries(keysArray.map((key) => [key, true]))
          : undefined,
      });

      console.log("Total results:", totalResults);
      console.log("Fetched results:", doc.length);

      res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  );

  static getAll = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { companyId } = req.params;
      const { page, limit, sortBy, sortType, search, keys, ...dynamicFilters } =
        req.query;

      // Convert query parameters to appropriate types
      const pageNumber = parseInt(page as string, 10) || 1;
      const pageSize = parseInt(limit as string, 10) || 100;
      const sortingField = (sortBy as keyof typeof prisma.manager) || "name";
      const sortingOrder = (sortType as "asc" | "desc") || "desc";

      const keysArray = keys ? (keys as string).split(",") : [];

      // Build the filter object based on provided parameters
      const filter: any = {
        companyId: parseInt(companyId, 10),
        deleted_at: null,
      };

      // Apply dynamic filters
      for (const [key, value] of Object.entries(dynamicFilters)) {
        if (typeof value === "string" || typeof value === "number") {
          filter[key] = value;
        }
      }

      // Add search condition if search query is provided
      if (search) {
        filter.OR = [
          { name: { contains: search as string } },
          { employeeId: { contains: search as string } },
          // Add more fields as needed for searching
        ];
      }

      try {
        // Count the total number of records matching the filter
        const totalResults = await prisma.manager.count({
          where: filter,
        });

        // Fetch the paginated results
        const doc = await prisma.manager.findMany({
          where: filter,
          skip: (pageNumber - 1) * pageSize,
          take: pageSize,
          orderBy: {
            [sortingField]: sortingOrder,
          },
          select: keysArray.length
            ? Object.fromEntries(keysArray.map((key) => [key, true]))
            : undefined,
        });

        res.status(200).json({
          status: "success",
          results: totalResults,
          data: doc,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  static getOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await prisma.manager.findFirst({
        where: { id: parseInt(id) },
      });

      if (!doc) {
        return next(
          new ErrorHandler("Manager with this id does not exist", 400)
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
      const doc = await prisma.manager.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          ...req.body,
        },
      });

      if (!doc) {
        return next(
          new ErrorHandler(
            `Manager not found with the provided id ${req.params.id}`,
            404
          )
        );
      }

      res.status(200).json({
        status: "success",
        message: "Manager updated successfully",
        data: doc,
      });
    }
  );

  static deleteOne = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const deleted = await prisma.manager.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      if (!deleted) {
        return next(
          new ErrorHandler(
            `Manager not found with the provided id ${req.params.id}`,
            404
          )
        );
      }

      res.status(200).json({
        status: "success",
        message: "Manager deleted successfully",
        data: null,
      });
    }
  );

  static softDelete = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const softDeleted = await prisma.manager.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          deleted_at: new Date(),
        },
      });

      if (!softDeleted) {
        return next(
          new ErrorHandler(
            `Manager not found with the provided id ${req.params.id}`,
            404
          )
        );
      }

      return res.status(200).json({
        status: "success",
        message: "Manager soft-deleted successfully",
        data: null,
      });
    }
  );
}

export default ManagerController;
