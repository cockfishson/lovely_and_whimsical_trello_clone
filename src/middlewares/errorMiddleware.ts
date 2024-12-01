import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errorHandling/customError.js";

export const errorMiddleware = (
  error: CustomError | Error,
  request: Request,
  response: Response,
  next: NextFunction 
) => {
  if (error instanceof CustomError) {
    response.status(error.statusCode).send({
      success: false,
      message: error.message || null,
      details: error.details || null,
    });
  } else {
    response.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
  next();
};