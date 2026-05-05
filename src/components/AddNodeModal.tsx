// src/components/AddNodeModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Globe2, MapPin, Users, Loader2, Plus } from "lucide-react";
import type { OrgFlatTreeNode } from "../types"; // Adjust path if needed

// Types for the Form Data we will send to the API
export interface CreateOrgNodeDto {
  name: string;
  code: string | null;
  label: "Country" | "Company" | "Branch" | "Staff";
  parentId: number | null;
}

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We pass the parent node so the form knows WHAT we are adding
  parentNode: OrgFlatTreeNode | null; 
  onSubmit: (data: CreateOrgNodeDto) => Promise<void>;
}

export default function AddNodeModal({ isOpen, onClose, parentNode, onSubmit }: AddNodeModalProps) {
  // Determine what type of entity we are creating based on the parent
  const targetLabel = parentNode 
    ? (parentNode.label === "Country" ? "Company" 
      : parentNode.label === "Company" ? "Branch" 
      : "Staff") 
    : "Country";

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState(""); // Only used for Staff
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName("");
      setCode("");
      setRole("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // If it's staff, we combine the name and role (e.g., "Ali - Manager") to match your data structure
      const finalName = targetLabel === "Staff" && role.trim() ? `${name} - ${role}` : name;

      await onSubmit({
        name: finalName,
        code: code.trim() || null,
        label: targetLabel as "Country" | "Company" | "Branch" | "Staff",
        parentId: parentNode ? parentNode.id : null
      });
      
      onClose(); // Close modal on success
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (targetLabel) {
      case "Country": return <Globe2 className="text-blue-500" size={24} />;
      case "Company": return <Building2 className="text-green-500" size={24} />;
      case "Branch": return <MapPin className="text-orange-500" size={24} />;
      case "Staff": return <Users className="text-slate-500" size={24} />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100 shadow-inner">
                  {getIcon()}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-[#0B1B3D]">Add New {targetLabel}</h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {parentNode ? `Adding to ${parentNode.name}` : "Creating root entity"}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-500/20">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Field: Name */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  {targetLabel === "Staff" ? "Employee Name" : `${targetLabel} Name`} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={targetLabel === "Staff" ? "e.g. John Doe" : "e.g. TechSoft"}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#0B1B3D] transition-colors focus:border-[#00A3FF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00A3FF]/10"
                  autoFocus
                />
              </div>

              {/* Field: Code (Hidden for Staff and Branches usually, but optional) */}
              {targetLabel !== "Staff" && targetLabel !== "Branch" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    System Code <span className="text-slate-400 font-medium normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. US, PK, TS"
                    maxLength={10}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#0B1B3D] transition-colors focus:border-[#00A3FF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00A3FF]/10 uppercase"
                  />
                </div>
              )}

              {/* Field: Role (ONLY for Staff) */}
              {targetLabel === "Staff" && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Job Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer, Manager"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#0B1B3D] transition-colors focus:border-[#00A3FF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00A3FF]/10"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-[#0B1B3D] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#00A3FF] hover:shadow-[#00A3FF]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Save {targetLabel}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}