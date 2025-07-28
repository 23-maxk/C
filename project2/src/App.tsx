import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FinancialDashboard from './components/FinancialDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import Jobs from './components/Jobs';
import Customers from './components/Customers';
import Invoices from './components/Invoices';
import Payments from './components/Payments';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import Products from './components/Products';
import Settings from './components/Settings';
import JobForm from './components/JobForm';
import CustomerForm from './components/CustomerForm';
import InvoiceForm from './components/InvoiceForm';
import ProductForm from './components/ProductForm';
import PaymentProcessor from './components/PaymentProcessor';
import CustomerDetail from './components/CustomerDetail';
import BankConnectionModal from './components/BankConnectionModal';
import AutomationRuleModal from './components/AutomationRuleModal';
import MetricModal from './components/MetricModal';
import EstimatePublicView from './components/EstimatePublicView';
import EstimatePublicViewWrapper from './components/EstimatePublicViewWrapper';
import { 
  mockCustomers, 
  mockJobs, 
  mockInvoices, 
  mockPayments, 
  mockExpenses, 
  mockBankAccounts,
  mockBankTransactions,
  mockDashboardStats,
  mockProducts,
  mockSettings,
  mockFinancialStats,
  mockAutomationRules,
  mockRecurringTransactions,
  mockEstimates,
  mockCalendarEvents,
  mockPhotoReports
} from './utils/data';
import { Customer, Job, Invoice, Payment, Expense, BankAccount, BankTransaction, Product, Settings as SettingsType, AutomationRule, RecurringTransaction, Estimate, CalendarEvent, PhotoReport } from './utils/types';
import Calendar from './components/Calendar';
import EstimateForm from './components/EstimateForm';
import PhotoReportForm from './components/PhotoReportForm';
import EstimateCreator from './components/EstimateCreator';
import { Plus } from 'lucide-react';

type ActiveTab = 'dashboard' | 'financial' | 'calendar' | 'jobs' | 'customers' | 'estimates' | 'invoices' | 'payments' | 'expenses' | 'reports' | 'photo-reports' | 'settings';

// Main App Component with Routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/dashboard" element={<AppContent />} />
      <Route path="/customers/new" element={<CustomerFormPage />} />
      <Route path="/customers/:id" element={<CustomerProfilePage />} />
      <Route path="/e/:token" element={<EstimatePublicViewWrapper />} />
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}

// Customer Form Page Component
function CustomerFormPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  const handleSaveCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    // Simulate API call
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    setCustomers([...customers, newCustomer]);
    
    // Redirect to customer profile
    navigate(`/customers/${newCustomer.id}`);
  };

  const handleSaveCustomerOnly = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    setCustomers([...customers, newCustomer]);
    
    // Go back to dashboard
    navigate('/dashboard');
  };

  return (
    <ThemeProvider>
      <Layout
        activeTab="customers"
        onTabChange={(tab) => navigate(`/${tab}`)}
        settings={mockSettings}
        showNavigation={true}
        onNewJob={() => {}}
        onNewCustomer={() => {}}
        onNewInvoice={() => {}}
      >
        <div className="max-w-2xl mx-auto">
          <CustomerForm
            isOpen={true}
            onClose={() => navigate('/dashboard')}
            onSave={handleSaveCustomerOnly}
            onSaveAndNavigate={handleSaveCustomer}
          />
        </div>
      </Layout>
    </ThemeProvider>
  );
}

// Customer Profile Page Component
function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customers] = useState<Customer[]>(mockCustomers);
  
  const customer = customers.find(c => c.id === id);
  
  if (!customer) {
    return (
      <ThemeProvider>
        <Layout
          activeTab="customers"
          onTabChange={(tab) => navigate(`/${tab}`)}
          settings={mockSettings}
          showNavigation={true}
          onNewJob={() => {}}
          onNewCustomer={() => navigate('/customers/new')}
          onNewInvoice={() => {}}
        >
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Customer Not Found
            </h2>
            <button
              onClick={() => navigate('/customers')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Customers
            </button>
          </div>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout
        activeTab="customers"
        onTabChange={(tab) => navigate(`/${tab}`)}
        settings={mockSettings}
        onBackToDashboard={() => navigate('/dashboard')}
        showNavigation={true}
        onNewJob={() => {}}
        onNewCustomer={() => navigate('/customers/new')}
        onNewInvoice={() => {}}
      >
        <CustomerDetail
          customer={customer}
          jobs={mockJobs.filter(job => job.customerId === customer.id)}
          invoices={mockInvoices.filter(invoice => invoice.customerId === customer.id)}
          payments={mockPayments.filter(payment => payment.customerId === customer.id)}
          photoReports={mockPhotoReports.filter(report => report.customerId === customer.id)}
          estimates={mockEstimates.filter(estimate => estimate.customerId === customer.id)}
          calendarEvents={mockCalendarEvents.filter(event => event.customerId === customer.id)}
          isFullScreen={true}
          onEditCustomer={(customer) => console.log('Edit customer:', customer)}
          onSendEmail={(customer) => console.log('Send email to:', customer.email)}
          onAddNote={(customer) => console.log('Add note for:', customer.name)}
          onCreateEstimate={(customerId) => console.log('Create estimate for:', customerId)}
          onOpenEstimateCreator={(customer) => console.log('Open estimate creator for:', customer)}
        />
      </Layout>
    </ThemeProvider>
  );
}

// Main App Content (Dashboard and other tabs)
function AppContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab | 'customer-profile'>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [bankTransactions] = useState<BankTransaction[]>(mockBankTransactions);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [settings, setSettings] = useState<SettingsType>(mockSettings);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(mockRecurringTransactions);
  const [estimates, setEstimates] = useState<Estimate[]>(mockEstimates);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [photoReports, setPhotoReports] = useState<PhotoReport[]>(mockPhotoReports);
  
  // Modal states
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPaymentProcessorOpen, setIsPaymentProcessorOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [isBankConnectionOpen, setIsBankConnectionOpen] = useState(false);
  const [isAutomationRuleOpen, setIsAutomationRuleOpen] = useState(false);
  const [isEstimateFormOpen, setIsEstimateFormOpen] = useState(false);
  const [isEstimateCreatorOpen, setIsEstimateCreatorOpen] = useState(false);
  const [selectedCustomerForEstimate, setSelectedCustomerForEstimate] = useState<Customer | null>(null);
  const [isPhotoReportFormOpen, setIsPhotoReportFormOpen] = useState(false);
  const [isCalendarEventFormOpen, setIsCalendarEventFormOpen] = useState(false);
  const [selectedCustomerForForm, setSelectedCustomerForForm] = useState<string>('');
  const [metricModal, setMetricModal] = useState<{
    isOpen: boolean;
    type: 'customers' | 'revenue' | 'jobs' | 'cashflow' | null;
  }>({ isOpen: false, type: null });

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setJobs([...jobs, newJob]);
    setSelectedCustomerForForm('');
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
    setEditingJob(null);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsJobFormOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setCustomers([...customers, newCustomer]);
  };

  const handleSaveInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setInvoices([...invoices, newInvoice]);
    setSelectedCustomerForForm('');
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleToggleProductActive = (id: string) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, isActive: !product.isActive, updatedAt: new Date() } : product
    ));
  };

  const handleProcessPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setPayments([...payments, newPayment]);
    
    // Update invoice status if payment is for an invoice
    if (paymentData.invoiceId) {
      setInvoices(invoices.map(invoice =>
        invoice.id === paymentData.invoiceId
          ? { ...invoice, status: 'paid' as const, paidAt: new Date() }
          : invoice
      ));
    }
  };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoiceForPayment(invoice);
    setIsPaymentProcessorOpen(true);
  };

  const handleMetricClick = (metric: 'customers' | 'revenue' | 'jobs' | 'cashflow') => {
    setMetricModal({ isOpen: true, type: metric });
  };

  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
  };

  const handleConnectBank = (bankData: Omit<BankAccount, 'id' | 'lastSynced'>) => {
    const newAccount: BankAccount = {
      ...bankData,
      id: Math.random().toString(36).substr(2, 9),
      lastSynced: new Date()
    };
    setBankAccounts([...bankAccounts, newAccount]);
  };

  const handleSaveAutomationRule = (ruleData: Omit<AutomationRule, 'id' | 'createdAt'>) => {
    const newRule: AutomationRule = {
      ...ruleData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    setAutomationRules([...automationRules, newRule]);
  };

  const handleSaveEstimate = (estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEstimate: Estimate = {
      ...estimateData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setEstimates([...estimates, newEstimate]);
    setSelectedCustomerForForm('');
  };

  const handleSaveEstimateFromCreator = (estimateData: any) => {
    const newEstimate: Estimate = {
      id: estimateData.id,
      customerId: estimateData.customerId,
      customerName: estimateData.customerName,
      estimateNumber: estimateData.estimateNumber,
      title: estimateData.title,
      description: estimateData.description,
      items: estimateData.items,
      subtotal: estimateData.subtotal,
      tax: estimateData.tax,
      total: estimateData.total,
      status: estimateData.status,
      validUntil: estimateData.validUntil,
      createdAt: estimateData.createdAt,
      updatedAt: estimateData.updatedAt,
      notes: estimateData.notes,
      terms: estimateData.terms
    };
    setEstimates([...estimates, newEstimate]);
    setSelectedCustomerForEstimate(null);
  };

  const handleOpenEstimateCreator = (customer: Customer) => {
    console.log('Opening estimate creator for customer:', customer);
    setSelectedCustomerForEstimate(customer);
    setIsEstimateCreatorOpen(true);
  };

  const handleSaveCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    setSelectedCustomerForForm('');
  };

  const handleSavePhotoReport = (reportData: Omit<PhotoReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReport: PhotoReport = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPhotoReports([...photoReports, newReport]);
    setSelectedCustomerForForm('');
  };

  const handleViewCustomerProfile = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleGenerateEstimatePDF = (estimate: Estimate) => {
    // PDF generation logic would go here
    console.log('Generating PDF for estimate:', estimate.estimateNumber);
  };

  const handleSendEstimateEmail = (estimate: Estimate) => {
    // Email sending logic would go here
    console.log('Sending email for estimate:', estimate.estimateNumber);
  };

  const handleGeneratePhotoReportPDF = (report: PhotoReport) => {
    // PDF generation logic would go here
    console.log('Generating PDF for photo report:', report.title);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            stats={mockDashboardStats}
            recentCustomers={customers.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())}
            recentJobs={jobs.slice(0, 5)}
            pendingInvoices={invoices.filter(i => i.status === 'sent')}
            recentPayments={payments.slice(0, 5)}
            bankAccounts={bankAccounts}
            onMetricClick={handleMetricClick}
            onCustomerClick={handleViewCustomerProfile}
          />
        );
      case 'financial':
        return (
          <ErrorBoundary>
            <FinancialDashboard
              stats={mockFinancialStats}
              bankAccounts={bankAccounts}
              recentTransactions={bankTransactions.slice(0, 10)}
              recentExpenses={expenses.slice(0, 5)}
              recentPayments={payments.slice(0, 5)}
              invoices={invoices}
              customers={customers}
              automationRules={automationRules}
              onConnectBank={() => setIsBankConnectionOpen(true)}
              onCreateAutomation={() => setIsAutomationRuleOpen(true)}
              onViewTransactions={() => setActiveTab('expenses')}
              onNewInvoice={() => setIsInvoiceFormOpen(true)}
              onPayInvoice={handlePayInvoice}
            />
          </ErrorBoundary>
        );
      case 'calendar':
        return (
          <Calendar
            events={calendarEvents}
            jobs={jobs}
            customers={customers}
            onNewEvent={() => setIsCalendarEventFormOpen(true)}
            onNewTask={() => setIsCalendarEventFormOpen(true)}
            onEventClick={(event) => console.log('Event clicked:', event)}
            onEventUpdate={(event) => {
              setCalendarEvents(calendarEvents.map(e => e.id === event.id ? event : e));
            }}
            onSaveNewCalendarEvent={handleSaveCalendarEvent}
            onUpdateJobDates={(jobId, startDate, endDate) => {
              setJobs(jobs.map(job => 
                job.id === jobId 
                  ? { ...job, startDate, endDate, updatedAt: new Date() }
                  : job
              ));
            }}
            teamMembers={[
              { id: '1', name: 'Chanton Stokley', color: '#3B82F6' },
              { id: '2', name: 'Alfred Bello', color: '#10B981' },
              { id: '3', name: 'Carlos Lopez', color: '#F59E0B' },
              { id: '4', name: 'Mike Rodriguez', color: '#8B5CF6' },
              { id: '5', name: 'Sarah Chen', color: '#EC4899' }
            ]}
          />
        );
      case 'photo-reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Photo Reports</h2>
                <p className="text-gray-600 dark:text-gray-400">Document work with photo reports</p>
              </div>
              <button
                onClick={() => setIsPhotoReportFormOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>New Photo Report</span>
              </button>
            </div>
            {/* Photo reports list would go here */}
          </div>
        );
      case 'estimates':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Estimates</h2>
                <p className="text-gray-600 dark:text-gray-400">Create and manage project estimates</p>
              </div>
              <button
                onClick={() => setIsEstimateFormOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>New Estimate</span>
              </button>
            </div>
            {/* Estimates list would go here */}
          </div>
        );
      case 'jobs':
        return (
          <Jobs
            jobs={jobs}
            customers={customers}
            onNewJob={() => setIsJobFormOpen(true)}
            onEditJob={handleEditJob}
          />
        );
      case 'customers':
        return (
          <Customers
            customers={customers}
            jobs={jobs}
            invoices={invoices}
            payments={payments}
            photoReports={photoReports}
            onNewCustomer={() => setIsCustomerFormOpen(true)}
            onEditCustomer={(customer) => {
              // Handle edit customer
              console.log('Edit customer:', customer);
            }}
            onNewJob={(customerId) => {
              setSelectedCustomerForForm(customerId);
              setIsJobFormOpen(true);
            }}
            onNewInvoice={(customerId) => {
              setSelectedCustomerForForm(customerId);
              setIsInvoiceFormOpen(true);
            }}
            onNewPhotoReport={(customerId) => {
              setSelectedCustomerForForm(customerId);
              setIsPhotoReportFormOpen(true);
            }}
            onCreateEstimate={(customerId) => {
              setSelectedCustomerForForm(customerId);
              setIsEstimateFormOpen(true);
            }}
            onOpenEstimateCreator={handleOpenEstimateCreator}
            onViewCustomerProfile={handleViewCustomerProfile}
          />
        );
      case 'invoices':
        return (
          <Invoices
            invoices={invoices}
            customers={customers}
            jobs={jobs}
            onNewInvoice={() => setIsInvoiceFormOpen(true)}
            onPayInvoice={handlePayInvoice}
          />
        );
      case 'payments':
        return (
          <Payments
            payments={payments}
            invoices={invoices}
            customers={customers}
            onNewPayment={() => setIsPaymentProcessorOpen(true)}
          />
        );
      case 'expenses':
        return (
          <Expenses
            expenses={expenses}
            jobs={jobs}
            bankTransactions={bankTransactions}
          />
        );
      case 'reports':
        return (
          <Reports
            jobs={jobs}
            invoices={invoices}
            payments={payments}
            expenses={expenses}
            customers={customers}
          />
        );
      case 'products':
        return (
          <Settings
            settings={settings}
            products={products}
            onSave={handleSaveSettings}
            onNewProduct={() => setIsProductFormOpen(true)}
            onEditProduct={handleEditProduct}
            onToggleProductActive={handleToggleProductActive}
          />
        );
      case 'settings':
        return (
          <Settings
            settings={settings}
            products={products}
            onSave={handleSaveSettings}
            onNewProduct={() => setIsProductFormOpen(true)}
            onEditProduct={handleEditProduct}
            onToggleProductActive={handleToggleProductActive}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        navigate(`/${tab}`);
      }}
      settings={settings}
      showNavigation={true}
      onNewJob={() => setIsJobFormOpen(true)}
      onNewCustomer={() => navigate('/customers/new')}
      onNewInvoice={() => setIsInvoiceFormOpen(true)}
    >
      {renderActiveTab()}
      
      <JobForm
        isOpen={isJobFormOpen}
        onClose={() => {
          setIsJobFormOpen(false);
          setEditingJob(null);
          setSelectedCustomerForForm('');
        }}
        customers={customers}
        editingJob={editingJob}
        preSelectedCustomerId={selectedCustomerForForm}
        onSave={handleSaveJob}
        onUpdate={handleUpdateJob}
      />
      
      <CustomerForm
        isOpen={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSave={handleSaveCustomer}
      />
      
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        onSave={handleSaveProduct}
        onUpdate={handleUpdateProduct}
      />
      
      <InvoiceForm
        isOpen={isInvoiceFormOpen}
        onClose={() => {
          setIsInvoiceFormOpen(false);
          setSelectedCustomerForForm('');
        }}
        customers={customers}
        jobs={jobs}
        preSelectedCustomerId={selectedCustomerForForm}
        onSave={handleSaveInvoice}
      />
      
      <EstimateForm
        isOpen={isEstimateFormOpen}
        onClose={() => {
          setIsEstimateFormOpen(false);
          setSelectedCustomerForForm('');
        }}
        customers={customers}
        products={products}
        settings={settings}
        preSelectedCustomerId={selectedCustomerForForm}
        onSave={handleSaveEstimate}
        onGeneratePDF={handleGenerateEstimatePDF}
        onSendEmail={handleSendEstimateEmail}
      />
      
      <PhotoReportForm
        isOpen={isPhotoReportFormOpen}
        onClose={() => {
          setIsPhotoReportFormOpen(false);
          setSelectedCustomerForForm('');
        }}
        jobs={jobs}
        customers={customers}
        preSelectedCustomerId={selectedCustomerForForm}
        onSave={handleSavePhotoReport}
        onGeneratePDF={handleGeneratePhotoReportPDF}
      />
      
      <PaymentProcessor
        isOpen={isPaymentProcessorOpen}
        onClose={() => {
          setIsPaymentProcessorOpen(false);
          setSelectedInvoiceForPayment(null);
        }}
        invoice={selectedInvoiceForPayment}
        customers={customers}
        onPaymentComplete={handleProcessPayment}
      />
      
      <BankConnectionModal
        isOpen={isBankConnectionOpen}
        onClose={() => setIsBankConnectionOpen(false)}
        onConnect={handleConnectBank}
      />
      
      <AutomationRuleModal
        isOpen={isAutomationRuleOpen}
        onClose={() => setIsAutomationRuleOpen(false)}
        onSave={handleSaveAutomationRule}
      />
      
      <MetricModal
        isOpen={metricModal.isOpen}
        onClose={() => setMetricModal({ isOpen: false, type: null })}
        type={metricModal.type}
        customers={customers}
        jobs={jobs}
        payments={payments}
      />
      
      <EstimateCreator
        isOpen={isEstimateCreatorOpen}
        onClose={() => {
          setIsEstimateCreatorOpen(false);
          setSelectedCustomerForEstimate(null);
        }}
        customer={selectedCustomerForEstimate}
        products={products}
        settings={settings}
        onSave={handleSaveEstimateFromCreator}
      />
    </Layout>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;