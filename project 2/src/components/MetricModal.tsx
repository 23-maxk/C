import React from 'react';
import { X, Users, DollarSign, Briefcase, TrendingUp } from 'lucide-react';
import { Customer, Job, Payment } from '../utils/types';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'customers' | 'revenue' | 'jobs' | 'cashflow' | null;
  customers: Customer[];
  jobs: Job[];
  payments: Payment[];
}

const MetricModal: React.FC<MetricModalProps> = ({
  isOpen,
  onClose,
  type,
  customers,
  jobs,
  payments
}) => {
  if (!isOpen || !type) return null;

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

  const getIcon = () => {
    switch (type) {
      case 'customers': return Users;
      case 'revenue': return DollarSign;
      case 'jobs': return Briefcase;
      case 'cashflow': return TrendingUp;
      default: return Users;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'customers': return 'All Customers';
      case 'revenue': return 'Revenue Breakdown';
      case 'jobs': return 'Active Jobs';
      case 'cashflow': return 'Cash Flow Details';
      default: return 'Details';
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const activeJobs = jobs.filter(job => job.status === 'in-progress' || job.status === 'scheduled');
  const sortedPayments = [...payments].sort((a, b) => b.date.getTime() - a.date.getTime());

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{getTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {type === 'customers' && (
            <div className="space-y-4">
              {sortedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{customer.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {customer.type} • {customer.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(customer.totalValue)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Added {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'revenue' && (
            <div className="space-y-4">
              {sortedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                        {payment.method.replace('_', ' ')} Payment
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'jobs' && (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.customerName} • {job.status.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(job.actualValue || job.estimatedValue)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">
                      {job.priority} priority
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'cashflow' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4">
                  <h3 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Total Income</h3>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Active Jobs Value</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(activeJobs.reduce((sum, j) => sum + (j.actualValue || j.estimatedValue), 0))}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
                {sortedPayments.slice(0, 10).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {payment.method.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(payment.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricModal;