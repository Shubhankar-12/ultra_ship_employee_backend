import { gql } from "apollo-server-express";

export const employeeTypeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String]!
    attendance: Float!
    email: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type PaginationMeta {
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type PaginatedEmployees {
    data: [Employee]!
    meta: PaginationMeta!
  }

  input EmployeeFilter {
    name: String
    class: String
    role: String
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String]!
    attendance: Float!
    email: String!
    password: String!
    role: String
  }

  input UpdateEmployeeInput {
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
    email: String
    role: String
  }

  type Query {
    employees(
      filter: EmployeeFilter
      page: Int
      limit: Int
      sortBy: String
      sortOrder: String
    ): PaginatedEmployees!
    employee(id: ID!): Employee
    me: Employee
  }

  type Mutation {
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    login(email: String!, password: String!): String!
  }
`;
