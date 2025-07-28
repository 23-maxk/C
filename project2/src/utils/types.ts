// Core Business Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  company?: string;
  type: 'residential' | 'commercial';
  category: 'client' | 'subcontractor' | 'insurance_agent' | 'team_member';
  tags: string[];
  notes: Note[];
  createdAt: Date;
  totalValue: number;
  status: 'active' | 'inactive' | 'prospect';
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  status: 'lead' | 'quoted' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedValue: number;
  actualValue?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  materials: Material[];
  laborHours: number;
  notes: Note[];
  invoices: Invoice[];
  payments: Payment[];
}

export interface Material {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  category: string;
}

export interface Invoice {
  id: string;
  jobId?: string;
  customerId: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdAt: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  jobId?: string;
  customerId: string;
  amount: number;
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  date: Date;
  notes?: string;
}

export interface Expense {
  id: string;
  jobId?: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  receipt?: string;
  vendor?: string;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer';
  bankTransactionId?: string;
  status: 'pending' | 'approved' | 'paid';
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDueDate?: Date;
}

export interface Note {
  id: string;
  entityId: string; // Can be customerId, jobId, etc.
  entityType: 'customer' | 'job' | 'invoice' | 'payment';
  content: string;
  date: Date;
  tags: string[];
  type: 'note' | 'call' | 'meeting' | 'email';
  createdBy?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  cost: number;
  price: number;
  profitMargin: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  companyName: string;
  companyLogo?: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  taxRate: number;
  currency: string;
  timezone: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bankAccountConnected: boolean;
  automationEnabled: boolean;
  recurringTransactionsEnabled: boolean;
}

export interface Estimate {
  id: string;
  customerId: string;
  customerName: string;
  estimateNumber: string;
  title: string;
  description: string;
  items: EstimateItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'declined' | 'expired';
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  terms?: string;
}

export interface EstimateItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task' | 'phone_call' | 'appointment' | 'lead_followup' | 'invoice_followup' | 'estimate_followup';
  jobId?: string;
  customerId?: string;
  assignedTo?: string[];
  subcontractors?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeEstimate?: number; // in hours
  description?: string;
  location?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  color?: string;
}

export interface PhotoReport {
  id: string;
  jobId?: string;
  customerId?: string;
  title: string;
  description: string;
  photos: PhotoReportItem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PhotoReportItem {
  id: string;
  imageUrl: string;
  caption: string;
  description: string;
  timestamp: Date;
  location?: string;
}