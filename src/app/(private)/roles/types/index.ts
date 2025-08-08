export interface FormDataRole {
    name: string;
    level: RoleLevel;
    description: string;
    permissions: Permission[];
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
    level: RoleLevel;
    description: string;
}

export type RoleLevel = "admin" | "manager" | "coordinator" | "supervisor";

export type Action = "read" | "write" | "delete" | "export";

export type Scope = "all" | "company" | "department" | "sector";

export interface Permission {
    module: ModuleID;
    actions: Action[];
    scope: Scope;
}

export type ModuleID =
    | "companies"
    | "employees"
    | "departments"
    | "sectors"
    | "teams"
    | "costcenters"
    | "budget"
    | "budgetperiods"
    | "reports"
    | "schedule"
    | "users";

