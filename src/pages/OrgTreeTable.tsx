import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe2, MapPin, Users, Loader2, Plus, Mail, Trash2, Edit2, Briefcase, ChevronRight, ArrowBigLeft, List, LayoutGrid } from "lucide-react";
import type { OrgFlatTreeNode } from "../types";
import { orgTreeApi } from "../api/orgTreeApi"; // Imported API
import AddNodeModal, { type CreateOrgNodeDto } from "../components/AddNodeModal";

export default function OrgTreeTable() {
  // --- STATE MANAGEMENT ---
  const [treeData, setTreeData] = useState<OrgFlatTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [breadcrumbs, setBreadcrumbs] = useState<OrgFlatTreeNode[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // --- API FETCH LOGIC ---
  const fetchOrganizationData = async () => {
    try {
      setIsLoading(true);
      const data = await orgTreeApi.getFlatTree();
      setTreeData(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch organization tree:", err);
      setError("Unable to connect to the server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  // --- API POST LOGIC (CREATE NEW NODE) ---
  const handleCreateNode = async (data: CreateOrgNodeDto) => {
    try {
      // 1. Send the new data to the C# Backend
      await orgTreeApi.createNode(data);
      
      // 2. Immediately refresh the table to show the new record
      const freshData = await orgTreeApi.getFlatTree();
      setTreeData(freshData);
    } catch (err) {
      console.error("Failed to create node:", err);
      throw err; // Let the modal catch this so it can show a red error message if it fails
    }
  };

  const currentParent = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : null;

  // GRID VIEW DATA: Only show direct children
  const gridNodes = treeData.filter((node) => 
    currentParent ? node.parentId === currentParent.id : node.parentId === null
  );

  // TABLE VIEW DATA: Recursively find ALL STAFF under the current active folder
  const tableStaffNodes = treeData.filter((node) => 
    node.label === "Staff" && (currentParent ? node.treePath?.startsWith(currentParent.treePath) : true)
  );

  // --- HANDLERS & HELPERS ---
  const handleNodeClick = (node: OrgFlatTreeNode) => {
    if (node.label === "Staff") return;
    setBreadcrumbs([...breadcrumbs, node]);
  };

  const getIcon = (label: string, className = "") => {
    switch (label) {
      case "Country": return <Globe2 className={className} />;
      case "Company": return <Building2 className={className} />;
      case "Branch": return <MapPin className={className} />;
      case "Staff": return <Users className={className} />;
      default: return <Briefcase className={className} />;
    }
  };

  // Flag generator based on country code
  const getFlag = (code: string | null) => {
    switch (code) {
      case "PK": return "🇵🇰";
      case "US": return "🇺🇸";
      case "UK": return "🇬🇧";
      default: return "";
    }
  };

  // --- LOADING & ERROR UI ---
  if (isLoading && treeData.length === 0) { // Only show full-screen loader on initial load
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={50} className="animate-spin text-[#00A3FF] mb-6" />
        <h2 className="text-2xl font-bold tracking-tight text-[#0B1B3D]">Loading Directory...</h2>
        <p className="text-sm font-medium text-slate-500 mt-2">Fetching live data from API...</p>
      </div>
    );
  }

  if (error && treeData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="max-w-md w-full rounded-xl bg-white p-8 text-center shadow-lg border border-red-100">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <Globe2 size={32} />
          </div>
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-[#0B1B3D]">Connection Failed</h2>
          <p className="mb-8 text-sm font-medium text-slate-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-[#0B1B3D] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#00A3FF]"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER & TOGGLES */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#0B1B3D]">Master Directory</h1>
            
            {/* VIEW TOGGLE */}
            <div className="flex items-center rounded-lg bg-white p-1 shadow-sm border border-slate-200">
              <button 
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "grid" ? "bg-[#00A3FF] text-white shadow" : "text-slate-500 hover:text-slate-900"}`}
              >
                <LayoutGrid size={16} /> Explorer
              </button>
              <button 
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "table" ? "bg-[#00A3FF] text-white shadow" : "text-slate-500 hover:text-slate-900"}`}
              >
                <List size={16} /> Data Table
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium">
            <button 
              onClick={() => setBreadcrumbs([])}
              className={`flex items-center gap-1 transition-colors ${breadcrumbs.length === 0 ? "text-[#00A3FF]" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Globe2 size={16} /> Global View
            </button>
            
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-2">
                <ChevronRight size={16} className="text-slate-400" />
                <button 
                  onClick={() => setBreadcrumbs(breadcrumbs.slice(0, index + 1))}
                  className={`flex items-center gap-1 transition-colors ${index === breadcrumbs.length - 1 ? "text-[#00A3FF]" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {getIcon(crumb.label, "w-4 h-4")}
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setBreadcrumbs(breadcrumbs.slice(0, -1))}
            disabled={breadcrumbs.length === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ArrowBigLeft size={16} /> Go Back
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)} // <-- WIRED THE MODAL OPENER HERE
            className="flex items-center gap-2 rounded-xl bg-[#00A3FF] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#00A3FF]/20 transition-all hover:bg-[#008DE6] active:scale-95"
          >
            <Plus size={18} />
            Add {currentParent ? (currentParent.label === "Branch" ? "Staff" : currentParent.label === "Company" ? "Branch" : "Company") : "Country"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${breadcrumbs.length}-${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* ======================================= */}
            {/* MODE 1: FOLDER EXPLORER (GRID VIEW)     */}
            {/* ======================================= */}
            {viewMode === "grid" && (
              <>
                {currentParent?.label !== "Branch" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {gridNodes.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node)}
                        className="group relative flex flex-col items-start rounded-xl bg-white p-6 text-left border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-[#00A3FF]"
                      >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#00A3FF] transition-colors group-hover:bg-[#00A3FF] group-hover:text-white text-xl">
                          {node.label === "Country" ? getFlag(node.code) : getIcon(node.label, "w-6 h-6")}
                        </div>
                        <h3 className="text-lg font-bold text-[#0B1B3D]">{node.name}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {node.code ? `System Code: ${node.code}` : `View ${node.label} Data`}
                        </p>
                        <ChevronRight className="absolute bottom-6 right-6 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#00A3FF]" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ======================================= */}
            {/* MODE 2: MASTER DIRECTORY TABLE          */}
            {/* ======================================= */}
            {/* This table renders for Staff inside Grid mode AND for everyone in Table mode */}
            {(viewMode === "table" || (viewMode === "grid" && currentParent?.label === "Branch")) && (
              <div className="overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    
                    {/* Professional Header */}
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4">Employee Profile</th>
                        <th className="px-6 py-4">System Role</th>
                        <th className="px-6 py-4">Office Branch</th>
                        <th className="px-6 py-4">Company Entity</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    
                    {/* Professional Body */}
                    <tbody className="divide-y divide-slate-200">
                      {(viewMode === "table" ? tableStaffNodes : gridNodes).map((staff) => {
                        
                        // Parse the name and role
                        const displayName = staff.name.split(" - ")[0];
                        const roleName = staff.name.split(" - ")[1] || "Staff";
                        
                        // Added safe fallback for path splitting
                        const pathParts = staff.treePath ? staff.treePath.split(" → ") : [];
                        const countryName = pathParts[0] || "—";
                        const companyName = pathParts[1] || "—";
                        const branchName = pathParts[2] || "—";

                        return (
                          <tr key={staff.id} className="transition-colors hover:bg-slate-50/70">
                            
                            {/* Profile Column */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-bold text-[#0B1B3D] shadow-sm">
                                  {displayName.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-[#0B1B3D]">{displayName}</div>
                                  <div className="text-xs text-slate-500 flex items-center">
                                    < Mail size={12} className="mr-1" /> {displayName.toLowerCase().replace(/\s+/g, '.')}@lalgroup.com
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role Column */}
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                                <Users size={12} className="mr-1.5 text-slate-500" />
                                {roleName}
                              </span>
                            </td>

                            {/* Branch Column */}
                            <td className="px-6 py-4 font-medium text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-orange-500" /> {branchName}
                              </div>
                            </td>

                            {/* Company Column */}
                            <td className="px-6 py-4 font-medium text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <Building2 size={14} className="text-green-600" /> {companyName}
                              </div>
                            </td>

                            {/* Country Column */}
                            <td className="px-6 py-4 font-medium text-slate-700">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">
                                  {countryName.includes("Pakistan") ? "🇵🇰" : countryName.includes("United States") ? "🇺🇸" : "🇬🇧"}
                                </span>
                                {countryName}
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span> Active
                              </span>
                            </td>

                            {/* Actions Column */}
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#00A3FF]" title="Edit"><Edit2 size={16} /></button>
                                <button className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
                              </div>
                            </td>

                          </tr>
                        );
                      })}

                      {/* Empty State */}
                      {(viewMode === "table" ? tableStaffNodes : gridNodes).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-16 text-center">
                            <Briefcase size={32} className="mx-auto text-slate-300 mb-3" />
                            <h3 className="text-sm font-semibold text-slate-800">No data found</h3>
                            <p className="text-xs text-slate-500 mt-1">Try selecting a different branch or adding new records.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* MODAL COMPONENT */}
        <AddNodeModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          parentNode={currentParent}
          onSubmit={handleCreateNode}
        />

      </div>
    </div>
  );
}