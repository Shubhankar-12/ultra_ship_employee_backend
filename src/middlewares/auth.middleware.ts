import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { ApiError } from "../utils/apiError";
import { Employee } from "../models/employee.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }

  try {
    const decoded: any = jwt.verify(token, config.jwtSecret);
    const user = await Employee.findById(decoded.id);

    if (!user) {
      return next(new ApiError(404, "No user found with this id"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Not authorized to access this route"));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
