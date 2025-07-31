import { Company } from "../../companies/types";
import { Role } from "../../roles/types";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    companies: Company[];
    status: 'active' | 'inactive';
    createdAt: string;
    lastLogin?: string;
}

export interface FormDataUser {
    name: string;
    email: string;
    role: Role;
    companies: Company[];
    status: 'active' | 'inactive';
    createdAt: string;
    lastLogin?: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    roleId: number;
    companyIds: number[];
    status: "active" | "inactive";
}
export interface UpdateUserInput {
    id: string;
    name: string;
    email: string;
    // password opcional
    password?: string;
    roleId: number;
    companyIds: number[];
    status: "active" | "inactive";
}