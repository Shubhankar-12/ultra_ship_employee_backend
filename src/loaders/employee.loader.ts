import DataLoader from "dataloader";
import { Employee, IEmployee } from "../models/employee.model";

// Batch function to fetch employees by IDs
const batchEmployees = async (
  ids: readonly string[]
): Promise<(IEmployee | Error)[]> => {
  const employees = await Employee.find({ _id: { $in: ids } });
  const employeeMap: { [key: string]: IEmployee } = {};
  employees.forEach((emp) => {
    employeeMap[emp._id.toString()] = emp;
  });

  return ids.map(
    (id) => employeeMap[id] || new Error(`Employee not found: ${id}`)
  );
};

export const createEmployeeLoader = () =>
  new DataLoader<string, IEmployee>(batchEmployees);
