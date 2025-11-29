import { Employee, IEmployee } from "../models/employee.model";
import { getPagination } from "../utils/pagination";
import { ApiError } from "../utils/apiError";

export const getAllEmployees = async (filter: any, options: any) => {
  const { limit, skip, sort, page } = getPagination(options);
  const employees = await Employee.find(filter)
    .sort(sort as any)
    .skip(skip)
    .limit(limit);
  const total = await Employee.countDocuments(filter);
  return {
    data: employees,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEmployeeById = async (id: string) => {
  const employee = await Employee.findById(id);
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  return employee;
};

export const createEmployee = async (input: Partial<IEmployee>) => {
  const employee = await Employee.create(input);
  return employee;
};

export const updateEmployee = async (id: string, input: Partial<IEmployee>) => {
  const employee = await Employee.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  return employee;
};

export const deleteEmployee = async (id: string) => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  return true;
};
