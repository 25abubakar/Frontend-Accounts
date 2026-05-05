// src/types/index.ts

export interface OrgNode {
  id: number;
  name: string;
  code: string | null;
  label: "Country" | "Company" | "Branch" | "Staff";
  parentId: number | null;
  parentName?: string;
}

export interface OrgFlatTreeNode extends OrgNode {
  level: number;
  treePath: string;
  treeStructure: string;
}

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
  roles: string[];
}