import { Customer, Job, Invoice, Payment, Expense, BankAccount, BankTransaction, Note, DashboardStats } from './types';
import { FinancialStats, AutomationRule, RecurringTransaction } from './types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Johnson Residence',
    email: 'mary.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Oak Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701'
    },
    type: 'residential',
    category: 'client',
    tags: ['roofing', 'repeat-customer', 'high-value'],
    notes: [],
    createdAt: new Date('2024-01-15'),
    totalValue: 25000,
    status: 'active'
  },
  {
    id: '2',
    name: 'ABC Manufacturing',
    email: 'facilities@abcmfg.com',
    phone: '+1 (555) 987-6543',
    company: 'ABC Manufacturing Inc.',
    address: {
      street: '456 Industrial Blvd',
      city: 'Springfield',
      state: 'IL',
      zip: '62702'
    },
    type: 'commercial',
    category: 'client',
    tags: ['commercial', 'hvac', 'maintenance-contract'],
    notes: [],
    createdAt: new Date('2024-01-10'),
    totalValue: 75000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Smith Family',
    email: 'john.smith@email.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '789 Maple Ave',
      city: 'Springfield',
      state: 'IL',
      zip: '62703'
    },
    type: 'residential',
    category: 'client',
    tags: ['plumbing', 'new-customer'],
    notes: [],
    createdAt: new Date('2024-01-20'),
    totalValue: 8500,
    status: 'prospect'
  },
  {
    id: '4',
    name: 'Elite Roofing Contractors',
    email: 'contact@eliteroofing.com',
    phone: '+1 (555) 234-5678',
    company: 'Elite Roofing Contractors LLC',
    type: 'commercial',
    category: 'subcontractor',
    tags: ['roofing', 'subcontractor', 'reliable'],
    notes: [],
    createdAt: new Date('2024-01-05'),
    totalValue: 0,
    status: 'active'
  },
  {
    id: '5',
    name: 'State Farm Insurance',
    email: 'claims@statefarm.com',
    phone: '+1 (555) 345-6789',
    company: 'State Farm Insurance',
    type: 'commercial',
    category: 'insurance_agent',
    tags: ['insurance', 'claims'],
    notes: [],
    createdAt: new Date('2024-01-08'),
    totalValue: 0,
    status: 'active'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Johnson Residence',
    title: 'Complete Roof Replacement',
    description: 'Replace entire roof with architectural shingles, including gutters and downspouts',
    status: 'in-progress',
    priority: 'high',
    estimatedValue: 25000,
    actualValue: 24500,
    startDate: new Date('2024-01-22'),
    endDate: new Date('2024-01-29'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-25'),
    assignedTo: 'Mike Rodriguez',
    materials: [
      {
        id: '1',
        name: 'Architectural Shingles',
        description: 'GAF Timberline HD Shingles - Charcoal',
        quantity: 35,
        unitCost: 120,
        totalCost: 4200,
        supplier: 'Home Depot Pro',
        category: 'roofing'
      },
      {
        id: '2',
        name: 'Gutters',
        description: '6" Seamless Aluminum Gutters',
        quantity: 150,
        unitCost: 8,
        totalCost: 1200,
        supplier: 'ABC Supply',
        category: 'gutters'
      }
    ],
    laborHours: 80,
    notes: [],
    invoices: [],
    payments: []
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'ABC Manufacturing',
    title: 'HVAC System Maintenance',
    description: 'Quarterly maintenance on all HVAC units',
    status: 'scheduled',
    priority: 'medium',
    estimatedValue: 2500,
    startDate: new Date('2024-02-01'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    assignedTo: 'Sarah Chen',
    materials: [],
    laborHours: 16,
    notes: [],
    invoices: [],
    payments: []
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Smith Family',
    title: 'Kitchen Plumbing Repair',
    description: 'Fix leaking pipes under kitchen sink and replace faucet',
    status: 'quoted',
    priority: 'medium',
    estimatedValue: 850,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
    materials: [],
    laborHours: 4,
    notes: [],
    invoices: [],
    payments: []
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    jobId: '1',
    customerId: '1',
    invoiceNumber: 'INV-2024-001',
    amount: 22000,
    tax: 1760,
    total: 23760,
    status: 'sent',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-25'),
    items: [
      {
        id: '1',
        description: 'Roof Replacement - Materials',
        quantity: 1,
        rate: 15000,
        amount: 15000
      },
      {
        id: '2',
        description: 'Labor - 80 hours',
        quantity: 80,
        rate: 87.5,
        amount: 7000
      }
    ],
    notes: 'Payment due within 30 days'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    customerId: '1',
    amount: 11880,
    method: 'credit_card',
    status: 'completed',
    date: new Date('2024-01-26'),
    notes: '50% deposit payment'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    jobId: '1',
    category: 'materials',
    description: 'Roofing materials from Home Depot',
    amount: 5400,
    date: new Date('2024-01-22'),
    vendor: 'Home Depot Pro',
    paymentMethod: 'credit_card',
    status: 'paid',
    notes: 'Materials for Johnson roof job'
  },
  {
    id: '2',
    category: 'fuel',
    description: 'Truck fuel',
    amount: 85,
    date: new Date('2024-01-23'),
    vendor: 'Shell Gas Station',
    paymentMethod: 'credit_card',
    bankTransactionId: 'txn_fuel_001',
    status: 'paid'
  },
  {
    id: '3',
    category: 'office',
    description: 'Office supplies',
    amount: 150,
    date: new Date('2024-01-24'),
    vendor: 'Staples',
    paymentMethod: 'credit_card',
    status: 'paid'
  }
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Business Checking',
    type: 'checking',
    balance: 45230,
    lastSynced: new Date('2024-01-25'),
    isActive: true
  },
  {
    id: '2',
    name: 'Business Savings',
    type: 'savings',
    balance: 25000,
    lastSynced: new Date('2024-01-25'),
    isActive: true
  },
  {
    id: '3',
    name: 'Business Credit Card',
    type: 'credit',
    balance: -2340,
    lastSynced: new Date('2024-01-25'),
    isActive: true
  }
];

export const mockBankTransactions: BankTransaction[] = [
  {
    id: '1',
    accountId: '1',
    amount: 11880,
    type: 'credit',
    description: 'Stripe payment from Johnson Residence',
    date: new Date('2024-01-26'),
    category: 'income',
    matched: true,
    matchedPaymentId: '1'
  },
  {
    id: '2',
    accountId: '3',
    amount: -5400,
    type: 'debit',
    description: 'Home Depot Pro - Materials',
    date: new Date('2024-01-22'),
    category: 'materials',
    matched: true,
    matchedExpenseId: '1'
  },
  {
    id: '3',
    accountId: '3',
    amount: -85,
    type: 'debit',
    description: 'Shell Gas Station',
    date: new Date('2024-01-23'),
    category: 'fuel',
    matched: true,
    matchedExpenseId: '2'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 156750,
  monthlyRevenue: 23760,
  pendingInvoices: 1,
  activeJobs: 2,
  totalCustomers: 3,
  cashFlow: 18480,
  profitMargin: 0.35,
  netProfit: 54750,
  totalExpenses: 102000,
  bankBalance: 45230
};

export const mockFinancialStats: FinancialStats = {
  totalIncome: 156750,
  totalExpenses: 102000,
  netProfit: 54750,
  profitMargin: 0.35,
  cashFlow: 18480,
  accountsReceivable: 23760,
  accountsPayable: 8500,
  bankBalance: 45230,
  monthlyTrend: [
    { month: 'Jan', income: 12000, expenses: 8000, profit: 4000 },
    { month: 'Feb', income: 15000, expenses: 9500, profit: 5500 },
    { month: 'Mar', income: 18000, expenses: 11000, profit: 7000 },
    { month: 'Apr', income: 22000, expenses: 13500, profit: 8500 },
    { month: 'May', income: 25000, expenses: 15000, profit: 10000 },
    { month: 'Jun', income: 28000, expenses: 16500, profit: 11500 }
  ],
  expensesByCategory: [
    { category: 'materials', amount: 45000, percentage: 44 },
    { category: 'labor', amount: 30000, percentage: 29 },
    { category: 'fuel', amount: 12000, percentage: 12 },
    { category: 'office', amount: 8000, percentage: 8 },
    { category: 'other', amount: 7000, percentage: 7 }
  ]
};

export const mockAutomationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto-categorize fuel expenses',
    description: 'Automatically categorize gas station transactions as fuel expenses',
    isActive: true,
    conditions: {
      descriptionContains: 'Shell',
      transactionType: 'debit'
    },
    actions: {
      category: 'Fuel',
      createExpense: true,
      notes: 'Auto-categorized fuel expense'
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Home Depot materials',
    description: 'Categorize Home Depot purchases as materials',
    isActive: true,
    conditions: {
      vendor: 'Home Depot',
      transactionType: 'debit'
    },
    actions: {
      category: 'Materials',
      createExpense: true,
      notes: 'Materials purchase'
    },
    createdAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Office supplies under $100',
    description: 'Small office supply purchases',
    isActive: false,
    conditions: {
      amountMax: 100,
      descriptionContains: 'Office',
      transactionType: 'debit'
    },
    actions: {
      category: 'Office Supplies',
      createExpense: true
    },
    createdAt: new Date('2024-01-15')
  }
];

export const mockRecurringTransactions: RecurringTransaction[] = [
  {
    id: '1',
    name: 'Office Rent',
    description: 'Monthly office space rental',
    amount: 2500,
    category: 'Office',
    frequency: 'monthly',
    nextDate: new Date('2024-02-01'),
    isActive: true,
    bankAccountId: '1',
    type: 'expense',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Insurance Premium',
    description: 'Business liability insurance',
    amount: 450,
    category: 'Insurance',
    frequency: 'monthly',
    nextDate: new Date('2024-02-15'),
    isActive: true,
    bankAccountId: '1',
    type: 'expense',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Maintenance Contract',
    description: 'Quarterly equipment maintenance',
    amount: 1200,
    category: 'Equipment',
    frequency: 'quarterly',
    nextDate: new Date('2024-04-01'),
    isActive: true,
    bankAccountId: '1',
    type: 'expense',
    createdAt: new Date('2024-01-01')
  }
];

export const mockNotes: Note[] = [
  {
    id: '1',
    entityId: '1',
    entityType: 'customer',
    content: 'Customer is very happy with the progress. Mentioned they might need siding work next year.',
    date: new Date('2024-01-25'),
    tags: ['follow-up', 'upsell-opportunity'],
    type: 'call',
    createdBy: 'Mike Rodriguez'
  },
  {
    id: '2',
    entityId: '1',
    entityType: 'job',
    content: 'Weather delay due to rain. Rescheduled completion for Monday.',
    date: new Date('2024-01-26'),
    tags: ['weather-delay', 'schedule-change'],
    type: 'note',
    createdBy: 'Mike Rodriguez'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Architectural Shingles',
    description: 'GAF Timberline HD Shingles - Premium quality roofing material',
    cost: 120,
    price: 180,
    profitMargin: 50,
    category: 'Roofing',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Seamless Gutters',
    description: '6" Aluminum seamless gutters with 20-year warranty',
    cost: 8,
    price: 15,
    profitMargin: 87.5,
    category: 'Gutters',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'HVAC Filter',
    description: 'High-efficiency MERV 13 air filter',
    cost: 25,
    price: 45,
    profitMargin: 80,
    category: 'HVAC',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockSettings: Settings = {
  companyName: 'BusinessFlow Pro',
  companyLogo: undefined,
  companyEmail: 'info@businessflow.com',
  companyPhone: '+1 (555) 123-4567',
  companyAddress: {
    street: '123 Business Ave',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  taxRate: 0.08,
  currency: 'USD',
  timezone: 'America/Chicago',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  bankAccountConnected: true
};

export const mockEstimates: Estimate[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Johnson Residence',
    estimateNumber: 'EST-2024-001',
    title: 'Roof Replacement Estimate',
    description: 'Complete roof replacement with architectural shingles',
    items: [
      {
        id: '1',
        name: 'Architectural Shingles',
        description: 'GAF Timberline HD - Charcoal',
        quantity: 35,
        unitPrice: 180,
        total: 6300
      },
      {
        id: '2',
        name: 'Labor',
        description: 'Installation and cleanup',
        quantity: 1,
        unitPrice: 8500,
        total: 8500
      }
    ],
    subtotal: 14800,
    tax: 1184,
    total: 15984,
    status: 'sent',
    validUntil: new Date('2024-02-25'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    terms: 'This estimate is valid for 30 days from the date issued.'
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Johnson Roof Inspection',
    start: new Date(2024, 6, 8, 9, 0),
    end: new Date(2024, 6, 8, 11, 0),
    type: 'job',
    jobId: '1',
    customerId: '1',
    assignedTo: 'Mike Rodriguez',
    description: 'Initial roof inspection and measurements',
    location: '123 Oak Street, Springfield, IL',
    status: 'scheduled',
    color: '#10B981'
  },
  {
    id: '2',
    title: 'Team Meeting',
    start: new Date(2024, 6, 10, 14, 0),
    end: new Date(2024, 6, 10, 15, 0),
    type: 'meeting',
    description: 'Weekly team sync',
    status: 'scheduled',
    color: '#8B5CF6'
  }
];

export const mockPhotoReports: PhotoReport[] = [
  {
    id: '1',
    jobId: '1',
    customerId: '1',
    title: 'Roof Damage Assessment',
    description: 'Documentation of roof damage found during inspection',
    photos: [
      {
        id: '1',
        imageUrl: 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
        caption: 'Missing shingles on north side',
        description: 'Several shingles are missing on the north side of the roof, exposing the underlayment to weather damage.',
        timestamp: new Date('2024-01-22T10:30:00'),
        location: 'North side roof'
      },
      {
        id: '2',
        imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        caption: 'Damaged gutters',
        description: 'Gutters are sagging and pulling away from the fascia board. Immediate repair needed.',
        timestamp: new Date('2024-01-22T10:45:00'),
        location: 'East side gutters'
      }
    ],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'Mike Rodriguez'
  }
];