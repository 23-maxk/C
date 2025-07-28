export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Job {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  estimatedHours: number;
  hourlyRate: number;
  createdAt: string;
  completedAt?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  jobId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

export interface Estimate {
  id: string;
  customerId: string;
  title: string;
  description: string;
  items: EstimateItem[];
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil: string;
  createdAt: string;
}

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}