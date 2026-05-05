// src/api/orgTreeApi.ts
import api from './axios';
import type { OrgFlatTreeNode } from '../types';

export const orgTreeApi = {
  // GET: Fetch all data
  getFlatTree: async () => {
    const response = await api.get<OrgFlatTreeNode[]>('/api/OrganizationTree/flat-tree');
    return response.data;
  },
  
  // POST: Create a new node (Country, Company, Branch, or Staff)
  createNode: async (data: any) => {
    const response = await api.post('/api/OrganizationTree', data);
    return response.data;
  }
};