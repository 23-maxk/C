import { Customer, Job, Invoice, Estimate } from '../types';

// Mock data for demonstration
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State 12345',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine St, City, State 12345',
    createdAt: '2024-02-01'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    customerId: '1',
    title: 'Website Redesign',
    description: 'Complete redesign of company website',
    status: 'in-progress',
    estimatedHours: 40,
    hourlyRate: 75,
    createdAt: '2024-01-16'
  },
  {
    id: '2',
    customerId: '2',
    title: 'Logo Design',
    description: 'Create new company logo and branding',
    status: 'completed',
    estimatedHours: 15,
    hourlyRate: 85,
    createdAt: '2024-01-21',
    completedAt: '2024-02-05'
  },
  {
    id: '3',
    customerId: '3',
    title: 'Mobile App Development',
    description: 'Develop iOS and Android mobile application',
    status: 'pending',
    estimatedHours: 120,
    hourlyRate: 90,
    createdAt: '2024-02-02'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    customerId: '2',
    jobId: '2',
    amount: 1275,
    status: 'paid',
    dueDate: '2024-02-20',
    createdAt: '2024-02-05',
    paidAt: '2024-02-18'
  },
  {
    id: '2',
    customerId: '1',
    jobId: '1',
    amount: 1500,
    status: 'sent',
    dueDate: '2024-03-15',
    createdAt: '2024-02-15'
  }
];

export const mockEstimates: Estimate[] = [
  {
    id: '1',
    customerId: '3',
    title: 'Mobile App Development Estimate',
    description: 'Complete mobile application development for iOS and Android',
    items: [
      {
        id: '1',
        description: 'UI/UX Design',
        quantity: 20,
        rate: 85,
        total: 1700
      },
      {
        id: '2',
        description: 'Frontend Development',
        quantity: 60,
        rate: 90,
        total: 5400
      },
      {
        id: '3',
        description: 'Backend Development',
        quantity: 40,
        rate: 95,
        total: 3800
      }
    ],
    total: 10900,
    status: 'sent',
    validUntil: '2024-03-15',
    createdAt: '2024-02-10'
  }
];

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

export const getJobsByCustomerId = (customerId: string): Job[] => {
  return mockJobs.filter(job => job.customerId === customerId);
};

export const getInvoicesByCustomerId = (customerId: string): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.customerId === customerId);
};

export const getEstimatesByCustomerId = (customerId: string): Estimate[] => {
  return mockEstimates.filter(estimate => estimate.customerId === customerId);
};