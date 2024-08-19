import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";
import crypto from "crypto";
import Email from "../utils/Email";
import queryResources from "../utils/QueryResources";
import { PrismaClient } from "@prisma/client";

const prisma = global.__db || new PrismaClient();

class CMS_UserController {
  // Method for Creating User
  static createUser = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, employeeId, phone, username, roleId, companyId } =
        req.body;

      // Validate required fields
      if (
        !email ||
        !employeeId ||
        !phone ||
        !username ||
        !roleId ||
        !companyId
      ) {
        return next(new ErrorHandler("Missing required fields.", 400));
      }

      try {
        console.log("Checking if user already exists...");
        const existingUser = await prisma.cms_Users.findFirst({
          where: { email },
        });
        if (existingUser) {
          console.log("User already exists.");
          return next(new ErrorHandler("User already exists.", 400));
        }

        console.log("Generating token and hashed token...");
        const token = crypto.randomBytes(32).toString("hex");
        const passwordToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");
        const passwordTokenExpire =
          Math.floor(Date.now() / 1000) + 24 * 60 * 60;

        const userData = {
          email,
          employeeId,
          phone,
          username,
          roleId,
          companyId,
          isActive: true,
          passwordToken,
          passwordTokenExpire,
        };

        console.log("Creating the new user...");
        const newUser = await prisma.cms_Users.create({
          data: userData,
        });

        console.log("Preparing and sending the password setup email...");
        const passwordLink = `http://localhost:5173/set-password/${token}`;
        const message = `Use the following link to set up your password, 
          <br/><br/>
          <strong><a href="${passwordLink}">${passwordLink}</a></strong><br/>
        `;
        // Ensure email and username are non-nullable strings
        const emailInstance = new Email(
          { email: newUser.email!, name: newUser.username! }, // Use non-null assertion
          message,
          "Password Reset"
        );
        await emailInstance.sendPasswordSetLink();

        console.log("User created successfully.");
        res.status(201).json({
          status: "success",
          message: "User created successfully",
          data: null,
        });
      } catch (err: any) {
        console.error("Error creating user:", err.message || err);
        return next(
          new ErrorHandler(
            `Something went wrong. Please try again. ${err.message || err}`,
            500
          )
        );
      }
    }
  );

  static getAllUsers = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { companyId } = req.params;
      const {
        page,
        limit,
        sortBy,
        sortType,
        employeeId,
        search,
        keys,
        ...dynamicFilters
      } = req.query;

      // Convert query parameters to appropriate types
      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 100;
      const sortingField = sortBy as keyof typeof prisma.cms_Users;
      const sortingOrder = (sortType as "asc" | "desc") || "desc";

      const keysArray = keys ? (keys as string).split(",") : [];

      // Build the filter object based on provided parameters
      const filter: any = {
        companyId: parseInt(companyId) as never,
        deleted_at: null as never,
        employeeId: employeeId as never,
      };

      for (const [key, value] of Object.entries(dynamicFilters)) {
        if (typeof value === "string") {
          filter[key] = value;
        }
      }

      // Add search condition if search query is provided
      if (search) {
        filter.OR = [
          { email: { contains: search as string } },
          { employeeId: { contains: search as string } },
          { username: { contains: search as string } },
          // Add more fields as needed for searching
        ];
      }

      const totalResults = await prisma.cms_Users.count({
        where: filter,
      });

      const users = await queryResources(prisma.cms_Users, {
        filter,
        keys: keysArray,
        include: { Role: true },
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
        data: users,
      });
    }
  );

  // Get all users
  static getAllUsersInfo = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await prisma.cms_Users.findMany({
        include: { Role: true },
      });

      if (!users || users.length === 0) {
        return next(new ErrorHandler("No users found", 404));
      }

      res.status(200).json({
        status: "success",
        data: users.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          employeeId: user.employeeId,
          roleId: user.roleId,
          created_at: user.created_at,
          role: user.Role,
        })),
      });
    }
  );

  static getOneUser = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const user = await prisma.cms_Users.findFirst({
        where: { id: parseInt(id) },
        include: { Role: true },
      });

      if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
      }

      res.status(200).json({
        status: "success",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          employeeId: user.employeeId,
          roleId: user.roleId,
          created_at: user.created_at,
          role: user.Role,
        },
      });
    }
  );

  // Method for deleting a user
  static deleteOneUser = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Finding the user by id and deleting it
      const deletedUser = await prisma.cms_Users.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      // If user is not found, return 404 error
      if (!deletedUser) {
        return next(
          new ErrorHandler(
            `User not found with the provided id ${req.params.id}`,
            404
          )
        );
      }

      // Return success message along with the deleted user data
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        data: deletedUser,
      });
    }
  );

  // Method for updating a user
  static updateUser = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { employeeId, phone, username, roleId } = req.body;

      // Finding the user by id and updating it
      const updatedUser = await prisma.cms_Users.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          employeeId,
          username,
          roleId,
        },
      });

      // If user is not found, return 404 error
      if (!updatedUser) {
        return next(
          new ErrorHandler(
            `User not found with the provided id ${req.params.id}`,
            400
          )
        );
      }

      // Return success message along with the updated user data
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
    }
  );
  // Method for soft deleting a user
  static softDeleteUser = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const user = await global.__db.cms_Users.update({
        where: { id: parseInt(id) },
        data: { isActive: false }, // Assuming you're soft-deleting by setting isActive to false
      });

      if (!user) {
        return next(new ErrorHandler(`User not found`, 404));
      }

      return res.status(200).json({
        status: "success",
        data: "User soft-deleted successfully",
      });
    }
  );
  // Method for user by RoleId
  static getUsersByRole = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { roleId } = req.params;
      const users = await global.__db.cms_Users.findMany({
        where: { roleId: parseInt(roleId) },
      });

      return res.status(200).json({
        status: "success",
        data: users,
      });
    }
  );
}

export default CMS_UserController;
