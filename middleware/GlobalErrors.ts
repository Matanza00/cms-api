import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import ErrorHandler from "../utils/ErrorHandler";

const prisma = new PrismaClient();

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
): ErrorHandler => {
  let message = "Internal Server Error";
  let statusCode = 500;

  switch (error.code) {
    case "P2002":
      message = `Duplicate value detected. Please use another value!`;
      statusCode = 400;
      break;
    case "P2025":
      // Record not found
      message = `Record not found.`;
      statusCode = 404;
      break;
    case "P2003":
      // Foreign key constraint failed
      message = `Foreign key constraint failed.`;
      statusCode = 400;
      break;
    // Add more Prisma error codes as needed
    default:
      message = `Prisma error: ${error.message}`;
  }

  return new ErrorHandler(message, statusCode);
};

const handleJwtExpiredError = (): ErrorHandler => {
  return new ErrorHandler("Token Expired. Please login again!", 401);
};

const handleJwtTokenError = (): ErrorHandler => {
  return new ErrorHandler("Invalid Token or has expired.", 401);
};

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): ErrorHandler => {
  const message = `Validation error: ${error.message}`;
  return new ErrorHandler(message, 400);
};

const sendErrDev = (err: ErrorHandler, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrProd = (err: ErrorHandler, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR>>>", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const GlobalErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaError(err);
      sendErrProd(error, res);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      error = handleValidationError(err);
      sendErrProd(error, res);
    } else if (err.name === "JsonWebTokenError") {
      error = handleJwtTokenError();
      sendErrProd(error, res);
    } else if (err.name === "TokenExpiredError") {
      error = handleJwtExpiredError();
      sendErrProd(error, res);
    } else {
      sendErrProd(err, res);
    }
  }
};

export default GlobalErrors;
