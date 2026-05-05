import { 
  LayoutDashboard, Users, Settings, Briefcase, LineChart, Shield 
} from "lucide-react";

// We define the type so TypeScript helps us catch errors
export type MenuItem = {
  name: string;
  path?: string;
  icon: React.ElementType;
  children?: { name: string; path: string }[];
};

export const navItems: MenuItem[] = [
  { 
    name: "Overview", 
    path: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    name: "Accounts & Groups", 
    icon: Users,
    children: [
      { name: "Master Directory", path: "/groups" },
      { name: "Companies & Entities", path: "/groups/companies" },
      { name: "Branch Management", path: "/groups/branches" },
      { name: "Staff Members", path: "/groups/staff" },
      { name: "Partner Portals", path: "/groups/partners" },
    ]
  },
  { 
    name: "Financial Operations", 
    icon: Briefcase,
    children: [
      { name: "Revenue Dashboard", path: "/finance/revenue" },
      { name: "Invoices & Billing", path: "/finance/invoices" },
      { name: "Expense Tracking", path: "/finance/expenses" },
      { name: "Tax Documentation", path: "/finance/tax" },
      { name: "Audit Logs", path: "/finance/audits" },
    ]
  },
  { 
    name: "System Analytics", 
    icon: LineChart,
    children: [
      { name: "Live Traffic", path: "/analytics/traffic" },
      { name: "User Engagement", path: "/analytics/engagement" },
      { name: "Custom Reports", path: "/analytics/reports" },
      { name: "Data Exports", path: "/analytics/export" },
    ]
  },
  { 
    name: "Security & Access", 
    icon: Shield,
    children: [
      { name: "Roles & Permissions", path: "/security/roles" },
      { name: "Authentication Logs", path: "/security/auth-logs" },
      { name: "API Key Management", path: "/security/api-keys" },
      { name: "IP Whitelisting", path: "/security/ip-whitelist" },
    ]
  },
  { 
    name: "Platform Settings", 
    icon: Settings,
    children: [
      { name: "General Preferences", path: "/settings/general" },
      { name: "Branding & Theming", path: "/settings/branding" },
      { name: "Email Templates", path: "/settings/emails" },
      { name: "Integration Setup", path: "/settings/integrations" },
    ]
  },
];