import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Receipt,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Eye,
  CheckCircle,
  FileText
} from 'lucide-react';
import { FinancialStats, BankAccount, BankTransaction, Expense, Payment, AutomationRule, Invoice, Customer } from '../utils/types';

interface FinancialDashboardProps {
  stats: FinancialStats;
  bankAccounts: BankAccount[];
  recentTransactions: BankTransaction[];
  recentExpenses: Expense[];
  recentPayments: Payment[];
  invoices: Invoice[];
  customers: Customer[];
  automationRules: AutomationRule[];
  onConnectBank: () => void;
  onCreateAutomation: () => void;
  onViewTransactions: () => void;
  onNewInvoice: () => void;
  onPayInvoice: (invoice: Invoice) => void;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  stats,
  bankAccounts,
  recentTransactions,
  recentExpenses,
  recentPayments,
  invoices,
  customers,
  automationRules,
  onConnectBank,
  onCreateAutomation,
  onViewTransactions,
  onNewInvoice,
  onPayInvoice
}) => {
  // Add console.log for debugging
  console.log('FinancialDashboard props:', {
    stats,
    bankAccounts: bankAccounts?.length,
    recentTransactions: recentTransactions?.length,
    recentExpenses: recentExpenses?.length,
    recentPayments: recentPayments?.length,
    invoices: invoices?.length,
    customers: customers?.length,
    automationRules: automationRules?.length
  });

  // Add safety checks for all props
  const safeStats = stats || {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    cashFlow: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
    bankBalance: 0,
    monthlyTrend: [],
    expensesByCategory: []
  };

  const safeBankAccounts = bankAccounts || [];
  const safeRecentTransactions = recentTransactions || [];
  const safeRecentExpenses = recentExpenses || [];
  const safeRecentPayments = recentPayments || [];
  const safeInvoices = invoices || [];
  const safeCustomers = customers || [];
  const safeAutomationRules = automationRules || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (date: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getTransactionIcon = (type: 'debit' | 'credit') => {
    return type === 'credit' ? ArrowUpRight : ArrowDownRight;
  };

  const getTransactionColor = (type: 'debit' | 'credit') => {
    return type === 'credit' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'scheduled': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20';
      case 'paid': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'sent': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'overdue': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your business finances and cash flow</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCreateAutomation}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Automation</span>
          </button>
          <button
            onClick={onConnectBank}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Building className="w-4 h-4" />
            <span>Connect Bank</span>
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className={`text-2xl font-bold ${safeStats.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(safeStats.netProfit)}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">86%</span>
                <span className="text-sm text-gray-500">from prior month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(safeStats.totalIncome)}</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Up 23%</span>
                <span className="text-sm text-gray-500">from prior month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(safeStats.totalExpenses)}</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Down 53%</span>
                <span className="text-sm text-gray-500">from prior 30 days</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cash Flow</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(safeStats.cashFlow)}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-sm text-gray-500">Future</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit & Loss */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profit & Loss</h3>
            <select className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 bg-white dark:bg-gray-800">
              <option>Last month</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Net profit for June</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(safeStats.netProfit)}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Income</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(safeStats.totalIncome)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Expenses</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(safeStats.totalExpenses)}</span>
              </div>
            </div>
            
            <button className="w-full text-left text-blue-600 dark:text-blue-400 text-sm hover:underline">
              Categorize 27 transactions
            </button>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoices</h3>
            <button
              onClick={onNewInvoice}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {safeInvoices.slice(0, 5).map((invoice) => {
              const customer = safeCustomers.find(c => c.id === invoice.customerId);
              
              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {customer?.name || 'Unknown Customer'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(invoice.total)}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {safeInvoices.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h4>
                <p className="text-gray-600 dark:text-gray-400">Create your first invoice to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bank Accounts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bank Accounts */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bank Accounts</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">As of today</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Today's bank balance</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(safeStats.bankBalance)}</span>
            </div>
            
            {safeBankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{account.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{account.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    account.balance >= 0 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(account.balance || 0)}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${account.isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500">
                      {account.isConnected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={onViewTransactions}
              className="w-full text-left text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              Go to report
            </button>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {safeRecentPayments.slice(0, 6).map((payment) => {
              const customer = safeCustomers.find(c => c.id === payment.customerId);
              
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {customer?.name || 'Unknown Customer'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(payment.date)} • {payment.method.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400 text-sm">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                      {payment.status}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {safeRecentPayments.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments yet</h4>
                <p className="text-gray-600 dark:text-gray-400">Payments will appear here once processed</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {safeRecentExpenses.slice(0, 6).map((expense) => {
              
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Receipt className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {expense.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(expense.date)} • {expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600 dark:text-red-400 text-sm">
                      -{formatCurrency(expense.amount)}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                      {expense.status}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {safeRecentExpenses.length === 0 && (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h4>
                <p className="text-gray-600 dark:text-gray-400">Expenses will appear here once added</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Automation Rules</h3>
          <button
            onClick={onCreateAutomation}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            Create new rule
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeAutomationRules.filter(rule => rule.isActive).map((rule) => (
            <div key={rule.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{rule.name}</h4>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rule.description}</p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Auto-categorizes as: <span className="font-medium">{rule.actions.category}</span>
              </div>
            </div>
          ))}
          
          {safeAutomationRules.filter(rule => rule.isActive).length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No automation rules active</p>
              <button
                onClick={onCreateAutomation}
                className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Create your first automation rule
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;