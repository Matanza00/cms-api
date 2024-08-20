import { Request, Response, NextFunction } from "express";
import { PrismaClient, cms_Users, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/AsyncHandler";
import ErrorHandler from "../utils/ErrorHandler";

const prisma = new PrismaClient();

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: cms_Users & { role: Role };
}

export const authProtect = (requiredRole?: string) =>
  catchAsync(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      let token;
      const { authorization } = req.headers;
      if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
      }
      if (!token) {
        return next(new ErrorHandler("Please login to get access.", 401));
      }

      // console.log("--", token);

      let decoded: DecodedToken;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      } catch (err) {
        console.log(err);
        return next(new ErrorHandler("Invalid Token or has expired..", 401));
      }

      const user = await prisma.cms_Users.findUnique({
        where: { id: parseInt(decoded.id) },
        include: { Role: true },
      });

      if (!user) {
        return next(
          new ErrorHandler("User no longer available. Please login again", 401)
        );
      }

      if (!user.Role) {
        return next(new ErrorHandler("No Role Added to user", 401));
      }

      if (requiredRole && user.Role.roleName !== requiredRole) {
        return next(
          new ErrorHandler(
            `You do not have permission to access this resource. Required role: ${requiredRole}`,
            403
          )
        );
      }

      // console.log(user);

      //@ts-ignore
      req.user = user;
      next();
    }
  );
