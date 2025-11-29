import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IEmployee extends Document {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  email: string;
  password?: string;
  role: "admin" | "employee";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const EmployeeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    age: { type: Number, required: true },
    class: { type: String, required: true, index: true },
    subjects: { type: [String], default: [] },
    attendance: { type: Number, default: 0, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
  },
  { timestamps: true }
);

EmployeeSchema.pre<IEmployee>("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

EmployeeSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);
