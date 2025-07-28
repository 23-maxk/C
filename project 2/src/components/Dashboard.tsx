import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Briefcase, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CreditCard,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { DashboardStats, BankAccount, BankTransaction, Expense, Payment, AutomationRule, Customer } from '../utils/types';

interface DashboardProps {
  stats: DashboardStats;
  recentCustomers: Customer[];
  recentJobs: Job[];
  pendingInvoices: Invoice[];
  recentPayments: Payment[];
  bankAccounts: BankAccount[];
  onMetricClick: (metric: 'customers' | 'revenue' | 'jobs' | 'cashflow') => void;
  onCustomerClick: (customer: Customer) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  recentCustomers,
  recentJobs, 
  pendingInvoices, 
  recentPayments, 
  bankAccounts,
  onMetricClick,
  onCustomerClick
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'scheduled': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20';
      case 'quoted': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/20';
      case 'paid': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'sent': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'overdue': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
          Welcome to BusinessFlow
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onMetricClick('revenue')}
          className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600/20 dark:to-emerald-700/20 border border-emerald-200 dark:border-emerald-600/30 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div 
          onClick={() => onMetricClick('revenue')}
          className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/20 dark:to-blue-700/20 border border-blue-200 dark:border-blue-600/30 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.monthlyRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div 
          onClick={() => onMetricClick('jobs')}
          className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-600/20 dark:to-amber-700/20 border border-amber-200 dark:border-amber-600/30 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div 
          onClick={() => onMetricClick('customers')}
          className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-600/20 dark:to-purple-700/20 border border-purple-200 dark:border-purple-600/30 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => onMetricClick('cashflow')}
          className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current Balance</span>
              <span className={`font-semibold ${stats.cashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(stats.cashFlow)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bank Total</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalBankBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(stats.profitMargin * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Invoices</h3>
          </div>
          <div className="space-y-3">
            {pendingInvoices.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">All invoices are paid!</p>
            ) : (
              pendingInvoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Due {formatDate(invoice.dueDate)}</p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
          </div>
          <div className="space-y-3">
            {recentPayments.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No recent payments</p>
            ) : (
              recentPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{payment.method}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(payment.date)}</p>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Added Customers</h3>
          </div>
          
          <div className="space-y-4">
            {recentCustomers.slice(0, 5).map((customer) => (
              <div
                key={customer.id}
                onClick={() => onCustomerClick(customer)}
                className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{customer.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="capitalize">{customer.type}</span>
                      {customer.email && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(customer.totalValue)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            
            {recentCustomers.length === 0 && (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers yet</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Add your first customer to get started
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Jobs</h3>
          </div>
          
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.customerName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                      {job.status.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(job.estimatedValue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bank Accounts */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bank Accounts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{account.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{account.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Last synced: {formatDate(account.lastSynced)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    account.balance >= 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(account.balance)}
                  </p>
                  <div className={`w-2 h-2 rounded-full ${account.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;