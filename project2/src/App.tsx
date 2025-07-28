import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Jobs from './components/Jobs';
import Customers from './components/Customers';
import Invoices from './components/Invoices';
import Estimates from './components/Estimates';
import Settings from './components/Settings';
import CustomerForm from './components/CustomerForm';
import JobForm from './components/JobForm';
import InvoiceForm from './components/InvoiceForm';
import EstimateForm from './components/EstimateForm';
import CustomerDetail from './components/CustomerDetail';
import { ThemeProvider } from './contexts/ThemeContext';
import { 
  Customer, 
  Job, 
  Invoice, 
  Estimate, 
  Payment, 
  Settings as SettingsType,
  Product,
  PhotoReport,
  CalendarEvent
} from './utils/types';

// Mock data
const mockSettings: SettingsType = {
  companyName: 'BusinessFlow',
  companyEmail: 'contact@businessflow.com',
  companyPhone: '(555) 123-4567',
  companyAddress: {
    street: '123 Business St',
    city: 'Business City',
    state: 'BC',
    zip: '12345'
  },
  taxRate: 0.08,
  currency: 'USD',
  timezone: 'America/New_York',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  accentColor: '#F59E0B',
  bankAccountConnected: false,
  automationEnabled: false,
  recurringTransactionsEnabled: false
};

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    },
    type: 'residential',
    category: 'client',
    tags: ['VIP', 'Referral'],
    notes: [],
    createdAt: new Date('2024-01-15'),
    totalValue: 15000,
    status: 'active'
  },
  {
    id: '2',
    name: 'ABC Corporation',
    email: 'contact@abc.com',
    phone: '(555) 987-6543',
    address: {
      street: '456 Business Ave',
      city: 'Commerce City',
      state: 'CA',
      zip: '54321'
    },
    company: 'ABC Corporation',
    type: 'commercial',
    category: 'client',
    tags: ['Commercial', 'Large Project'],
    notes: [],
    createdAt: new Date('2024-02-01'),
    totalValue: 45000,
    status: 'active'
  }
];

const mockJobs: Job[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Smith',
    title: 'Kitchen Renovation',
    description: 'Complete kitchen remodel including cabinets, countertops, and appliances',
    status: 'in-progress',
    priority: 'high',
    estimatedValue: 15000,
    actualValue: 14500,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-30'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-10'),
    assignedTo: 'Mike Johnson',
    materials: [],
    laborHours: 120,
    notes: [],
    invoices: [],
    payments: []
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'financial' | 'jobs' | 'customers' | 'invoices' | 'payments' | 'expenses' | 'reports' | 'calendar' | 'estimates' | 'photo-reports' | 'settings' | 'customer-profile'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [photoReports, setPhotoReports] = useState<PhotoReport[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form states
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [isEstimateFormOpen, setIsEstimateFormOpen] = useState(false);

  const handleNewCustomer = () => {
    setIsCustomerFormOpen(true);
  };

  const handleNewJob = () => {
    setIsJobFormOpen(true);
  };

  const handleNewInvoice = () => {
    setIsInvoiceFormOpen(true);
  };

  const handleNewEstimate = () => {
    setIsEstimateFormOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setCustomers([...customers, newCustomer]);
  };

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setJobs([...jobs, newJob]);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setInvoices([...invoices, newInvoice]);
  };

  const handleSaveEstimate = (estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEstimate: Estimate = {
      ...estimateData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEstimates([...estimates, newEstimate]);
  };

  const renderContent = () => {
    if (activeTab === 'customer-profile' && selectedCustomer) {
      return (
        <CustomerDetail
          customer={selectedCustomer}
          jobs={jobs.filter(job => job.customerId === selectedCustomer.id)}
          invoices={invoices.filter(invoice => invoice.customerId === selectedCustomer.id)}
          payments={payments.filter(payment => payment.customerId === selectedCustomer.id)}
          photoReports={photoReports.filter(report => report.customerId === selectedCustomer.id)}
          estimates={estimates.filter(estimate => estimate.customerId === selectedCustomer.id)}
          calendarEvents={calendarEvents.filter(event => event.customerId === selectedCustomer.id)}
          onEditCustomer={(customer) => console.log('Edit customer:', customer)}
          onSendEmail={(customer) => console.log('Send email to:', customer)}
          onAddNote={(customer) => console.log('Add note for:', customer)}
          onCreateEstimate={(customerId) => console.log('Create estimate for:', customerId)}
          onOpenEstimateCreator={(customer) => {
            setIsEstimateFormOpen(true);
          }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'jobs':
        return <Jobs />;
      case 'invoices':
        return <Invoices />;
      case 'estimates':
        return <Estimates />;
      case 'settings':
        return <Settings settings={settings} onSave={setSettings} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Layout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          settings={settings}
          onBackToDashboard={() => {
            setActiveTab('dashboard');
            setSelectedCustomer(null);
          }}
          showNavigation={activeTab !== 'customer-profile'}
          onNewJob={handleNewJob}
          onNewCustomer={handleNewCustomer}
          onNewInvoice={handleNewInvoice}
        >
          {renderContent()}
        </Layout>

        {/* Forms */}
        <CustomerForm
          isOpen={isCustomerFormOpen}
          onClose={() => setIsCustomerFormOpen(false)}
          onSave={handleSaveCustomer}
          onSaveAndNavigate={(customerData) => {
            const newCustomer: Customer = {
              ...customerData,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date()
            };
            setCustomers([...customers, newCustomer]);
            setSelectedCustomer(newCustomer);
            setActiveTab('customer-profile');
          }}
        />

        <JobForm
          isOpen={isJobFormOpen}
          onClose={() => setIsJobFormOpen(false)}
          customers={customers}
          onSave={handleSaveJob}
        />

        <InvoiceForm
          isOpen={isInvoiceFormOpen}
          onClose={() => setIsInvoiceFormOpen(false)}
          customers={customers}
          jobs={jobs}
          onSave={handleSaveInvoice}
        />

        <EstimateForm
          isOpen={isEstimateFormOpen}
          onClose={() => setIsEstimateFormOpen(false)}
          customers={customers}
          products={products}
          settings={settings}
          onSave={handleSaveEstimate}
          onGeneratePDF={(estimate) => console.log('Generate PDF for:', estimate)}
          onSendEmail={(estimate) => console.log('Send email for:', estimate)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;