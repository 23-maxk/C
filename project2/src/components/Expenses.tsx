import React from 'react';
import { Receipt, Plus, Search, Filter, Building, Fuel, Wrench } from 'lucide-react';
import { Expense, Job, BankTransaction } from '../utils/types';

interface ExpensesProps {
  expenses: Expense[];
  jobs: Job[];
  bankTransactions: BankTransaction[];
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, jobs, bankTransactions }) => {
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
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'paid': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'approved': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'pending': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'materials': return <Building className="w-5 h-5" />;
      case 'fuel': return <Fuel className="w-5 h-5" />;
      case 'tools': return <Wrench className="w-5 h-5" />;
      default: return <Receipt className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'materials': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'fuel': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/20';
      case 'tools': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/20';
      case 'office': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Expenses</h2>
          <p className="text-gray-600 dark:text-gray-400">Track business expenses and costs</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25">
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-600/20 dark:to-red-700/20 border border-red-200 dark:border-red-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
            <Receipt className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-600/20 dark:to-amber-700/20 border border-amber-200 dark:border-amber-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {expenses.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <Receipt className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600/20 dark:to-emerald-700/20 border border-emerald-200 dark:border-emerald-600/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(expenses.filter(e => 
                  e.date.getMonth() === new Date().getMonth()
                ).reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
            <Receipt className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.map((expense) => {
          const job = expense.jobId ? jobs.find(j => j.id === expense.jobId) : null;
          
          return (
            <div
              key={expense.id}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                    {getCategoryIcon(expense.category)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {expense.description}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="capitalize">{expense.category}</span>
                      {expense.vendor && (
                        <>
                          <span>•</span>
                          <span>{expense.vendor}</span>
                        </>
                      )}
                      {job && (
                        <>
                          <span>•</span>
                          <span>{job.title}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {formatDate(expense.date)} • {expense.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatCurrency(expense.amount)}
                  </p>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>
              </div>
              
              {expense.notes && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{expense.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {expenses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-gray-500 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Start tracking your business expenses</p>
        </div>
      )}
    </div>
  );
};

export default Expenses;