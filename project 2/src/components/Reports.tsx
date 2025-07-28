import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { Job, Invoice, Payment, Expense, Customer } from '../utils/types';

interface ReportsProps {
  jobs: Job[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: Expense[];
  customers: Customer[];
}

const Reports: React.FC<ReportsProps> = ({ 
  jobs, 
  invoices, 
  payments, 
  expenses, 
  customers 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const completedJobs = jobs.filter(job => job.status === 'completed');
  const averageJobValue = completedJobs.length > 0 
    ? completedJobs.reduce((sum, job) => sum + (job.actualValue || job.estimatedValue), 0) / completedJobs.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Business performance insights</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600/20 dark:to-emerald-700/20 border border-emerald-200 dark:border-emerald-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-600/20 dark:to-red-700/20 border border-red-200 dark:border-red-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/20 dark:to-blue-700/20 border border-blue-200 dark:border-blue-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(netProfit)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-600/20 dark:to-purple-700/20 border border-purple-200 dark:border-purple-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{profitMargin.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Business Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Job Performance</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Total Jobs</span>
              <span className="font-semibold text-gray-900 dark:text-white">{jobs.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Completed Jobs</span>
              <span className="font-semibold text-gray-900 dark:text-white">{completedJobs.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Average Job Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(averageJobValue)}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Completion Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {jobs.length > 0 ? ((completedJobs.length / jobs.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Financial Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Outstanding Invoices</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {invoices.filter(i => i.status === 'sent').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Total Customers</span>
              <span className="font-semibold text-gray-900 dark:text-white">{customers.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Average Payment</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(payments.length > 0 ? totalRevenue / payments.length : 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
              <span className="text-gray-700 dark:text-gray-300">Customer Lifetime Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(customers.length > 0 ? totalRevenue / customers.length : 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Expense Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['materials', 'fuel', 'office'].map(category => {
            const categoryExpenses = expenses.filter(e => e.category.toLowerCase() === category);
            const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
            const percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;
            
            return (
              <div key={category} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/20 dark:to-blue-700/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{category}</h4>
                <p className="text-gray-600 dark:text-gray-400">{formatCurrency(categoryTotal)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;