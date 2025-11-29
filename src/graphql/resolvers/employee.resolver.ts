import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from "apollo-server-express";
import jwt from "jsonwebtoken";
import { Employee } from "../../models/employee.model";
import * as employeeService from "../../services/employee.service";
import { config } from "../../config/env";

export const employeeResolvers = {
  Query: {
    employees: async (
      _: any,
      { filter, page, limit, sortBy, sortOrder }: any,
      context: any
    ) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      return await employeeService.getAllEmployees(filter || {}, {
        page,
        limit,
        sortBy,
        sortOrder,
      });
    },
    employee: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      return await employeeService.getEmployeeById(id);
    },
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      return context.user;
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const employee = await Employee.findOne({ email }).select("+password");
      if (!employee || !(await employee.comparePassword(password))) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = jwt.sign({ id: employee._id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      } as jwt.SignOptions);
      return token;
    },
    addEmployee: async (_: any, { input }: any, context: any) => {
      const count = await Employee.countDocuments();
      if (count > 0) {
        if (!context.user) throw new AuthenticationError("Not authenticated");
        if (context.user.role !== "admin")
          throw new ForbiddenError("Not authorized");
      }

      return await employeeService.createEmployee(input);
    },
    updateEmployee: async (_: any, { id, input }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      if (context.user.role !== "admin" && context.user.id !== id) {
        throw new ForbiddenError("Not authorized to update other employees");
      }
      return await employeeService.updateEmployee(id, input);
    },
    deleteEmployee: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      if (context.user.role !== "admin")
        throw new ForbiddenError("Not authorized");
      return await employeeService.deleteEmployee(id);
    },
  },
};
