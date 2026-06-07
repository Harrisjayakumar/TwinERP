// ─── Core Types ────────────────────────────────────────────────────────────────

export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER" | "GUEST";

export interface User {
  id: string;
  organizationId: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  phone?: string | null;
  role: UserRole;
  permissions?: Record<string, boolean> | null;
  mfaEnabled: boolean;
  lastLoginAt?: Date | null;
  isActive: boolean;
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  country: string;
  currency: string;
  timezone: string;
  gstNumber?: string | null;
  cin?: string | null;
  pan?: string | null;
  address?: Address | null;
  settings?: OrgSettings | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrgSettings {
  invoicePrefix?: string;
  estimatePrefix?: string;
  dateFormat?: string;
  fiscalYearStart?: string;
  taxInclusive?: boolean;
}

export interface Session {
  userId: string;
  email: string;
  organizationId: string;
  role: UserRole;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  currency: string;
  interval: string;
  trialDays: number;
  features: string[];
  limits: PlanLimits;
  isActive: boolean;
}

export interface PlanLimits {
  users?: number;
  storage?: number; // GB
  invoices?: number;
  projects?: number;
  employees?: number;
  apiCalls?: number;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date | null;
  cancelledAt?: Date | null;
}

// ─── Sales & Finance Types ────────────────────────────────────────────────────

export type InvoiceStatus = "DRAFT" | "SENT" | "VIEWED" | "PAID" | "PARTIAL" | "OVERDUE" | "CANCELLED" | "VOID";
export type EstimateStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  gstNumber?: string | null;
  billingAddress?: Address | null;
  currency: string;
  creditLimit?: number | null;
  tags: string[];
  createdAt: Date;
}

export interface Invoice {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  lineItems?: InvoiceLineItem[];
  createdAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  productId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

// ─── HRM Types ────────────────────────────────────────────────────────────────

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN" | "FREELANCE";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  managerId?: string | null;
  parentId?: string | null;
}

export interface Employee {
  id: string;
  organizationId: string;
  userId?: string | null;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  departmentId?: string | null;
  department?: Department | null;
  designation?: string | null;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joinDate: Date;
  exitDate?: Date | null;
  salary?: number | null;
  managerId?: string | null;
  createdAt: Date;
}

// ─── CRM Types ────────────────────────────────────────────────────────────────

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CONVERTED" | "LOST";
export type DealStatus = "OPEN" | "WON" | "LOST";

export interface Contact {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  title?: string | null;
  source?: string | null;
  tags: string[];
  createdAt: Date;
}

export interface Lead {
  id: string;
  organizationId: string;
  contactId?: string | null;
  contact?: Contact | null;
  title: string;
  value?: number | null;
  source?: string | null;
  status: LeadStatus;
  assigneeId?: string | null;
  createdAt: Date;
}

export interface Deal {
  id: string;
  organizationId: string;
  contactId?: string | null;
  contact?: Contact | null;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: Date | null;
  status: DealStatus;
  createdAt: Date;
}

// ─── Project Types ────────────────────────────────────────────────────────────

export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELLED";

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: string;
  startDate?: Date | null;
  endDate?: Date | null;
  budget?: number | null;
  progress: number;
  clientId?: string | null;
  managerId?: string | null;
  teamMembers: string[];
  tags: string[];
  createdAt: Date;
}

export interface Task {
  id: string;
  organizationId: string;
  projectId?: string | null;
  sprintId?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: string;
  assigneeId?: string | null;
  dueDate?: Date | null;
  estimatedHours?: number | null;
  loggedHours?: number | null;
  createdAt: Date;
}

// ─── Expense Types ────────────────────────────────────────────────────────────

export type ExpenseStatus = "PENDING" | "APPROVED" | "REJECTED" | "REIMBURSED";

export interface Expense {
  id: string;
  organizationId: string;
  userId?: string | null;
  category: string;
  amount: number;
  currency: string;
  date: Date;
  description?: string | null;
  receiptUrl?: string | null;
  status: ExpenseStatus;
  approvedBy?: string | null;
  approvedAt?: Date | null;
  vendorId?: string | null;
  projectId?: string | null;
  tags: string[];
  createdAt: Date;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

// ─── RBAC ─────────────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Finance
  INVOICE_CREATE: "invoice:create",
  INVOICE_READ: "invoice:read",
  INVOICE_UPDATE: "invoice:update",
  INVOICE_DELETE: "invoice:delete",
  // HRM
  EMPLOYEE_CREATE: "employee:create",
  EMPLOYEE_READ: "employee:read",
  EMPLOYEE_UPDATE: "employee:update",
  EMPLOYEE_DELETE: "employee:delete",
  // Projects
  PROJECT_CREATE: "project:create",
  PROJECT_READ: "project:read",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  // Settings
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",
  // Users
  USER_INVITE: "user:invite",
  USER_MANAGE: "user:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: Object.values(PERMISSIONS) as Permission[],
  ADMIN: Object.values(PERMISSIONS) as Permission[],
  MANAGER: [
    "invoice:create", "invoice:read", "invoice:update",
    "employee:read", "employee:update",
    "project:create", "project:read", "project:update",
    "settings:read",
  ] as Permission[],
  MEMBER: [
    "invoice:read",
    "employee:read",
    "project:read",
    "settings:read",
  ] as Permission[],
  VIEWER: [
    "invoice:read",
    "employee:read",
    "project:read",
  ] as Permission[],
  GUEST: ["project:read"] as Permission[],
};

// ─── KPI Types ────────────────────────────────────────────────────────────────

export interface KPICard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface Notification {
  id: string;
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  message?: string | null;
  data?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
  organizationSlug?: string;
  planSlug?: string;
}

export interface AuthResponse {
  user: User;
  organization: Organization;
  accessToken: string;
}
