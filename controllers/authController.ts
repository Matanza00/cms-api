import { Request, Response, NextFunction } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/ErrorHandler";
import {
  createJwtToken,
  decryptPassword,
  getHashedPassword,
} from "../utils/HelperFunction";
import Email from "../utils/Email";
import crypto from "crypto";

class AuthController {
  static login = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Fields missing.", 400));
      }

      const user = await global.__db.cms_Users.findFirst({
        where: { email },
        include: {
          Role: {
            include: {
              rolePermissions: {
                where: {
                  list: true,
                },
                include: {
                  module: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) return next(new ErrorHandler("User Not found", 400));

      if (!user.password) {
        return next(
          new ErrorHandler(
            "Your Password is not set. Please contact your administrator to activate your account.",
            400
          )
        );
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return next(new ErrorHandler("Wrong Credentials", 400));
      }

      const userId = user.id;
      const token = createJwtToken(userId.toString());

      const simplifiedRolePermissions =
        user.Role?.rolePermissions.filter(
          (permission: any) => permission.list
        ) || [];

      const userData = {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        username: user.username,
        companyId: user.companyId,
        Role: {
          roleName: user.Role?.roleName || "",
          rolePermissions: simplifiedRolePermissions,
        },
      };

      res.status(201).json({
        status: "success",
        token,
        data: { user: userData },
      });
    }
  );

  static sendCredentials = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const user = await global.__db.cms_Users.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return next(new ErrorHandler("User Not found", 400));
      }

      const email = user.email ?? "";
      const username = user.username ?? "";
      const password = decryptPassword(
        user.encryptedPassword ?? "",
        user.keyHex ?? "",
        user.ivHex ?? ""
      );

      const message = `Here are your login credentials
      <br/><br/>
Email:    <strong> ${email}</strong><br/>
Password: <strong> ${password}</strong>
      <br/>
      `;

      const emailInstance = new Email(
        { email: user.email ?? "", name: user.username ?? "" },
        message,
        "Credentials"
      );
      await emailInstance.sendCredentials();

      res.status(200).json({
        status: "success",
        message: "Credentials Sent Successfully",
      });
    }
  );

  static setPassword = AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { token } = req.params;
      const { password } = req.body;
      const hashToken = crypto.createHash("sha256").update(token).digest("hex");

      const user = await global.__db.cms_Users.findFirst({
        where: {
          // Make sure 'passwordToken' is a valid property or adjust accordingly
          passwordToken: hashToken,
        },
      });

      if (!user) {
        return next(new ErrorHandler("Invalid Link or expired", 400));
      }

      const hashedPassword = await getHashedPassword(password);

      const updatedUser = await global.__db.cms_Users.update({
        where: {
          id: user.id,
        },
        data: { password: hashedPassword },
      });

      if (!updatedUser) {
        return next(new ErrorHandler("Error Setting Password", 400));
      }

      res.status(200).json({
        status: "success",
        message: "Password Updated Successfully",
      });
    }
  );
}

export default AuthController;
