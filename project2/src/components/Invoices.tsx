import React from 'react';
import { FileText, Plus, Search, Filter, Eye, CreditCard } from 'lucide-react';
import { Invoice, Customer, Job } from '../utils/types';

interface InvoicesProps {
  invoices: Invoice[];
  customers: Customer[];
  jobs: Job[];
  onNewInvoice: () => void;
  onPayInvoice: (invoice: Invoice) => void;
}

const Invoices: React.FC<InvoicesProps> = ({ 
  invoices, 
  customers, 
  jobs, 
  onNewInvoice, 
  onPayInvoice 
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
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'sent': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'overdue': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Invoices</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage billing and payments</p>
        </div>
        <button
          onClick={onNewInvoice}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {invoices.map((invoice) => {
          const customer = customers.find(c => c.id === invoice.customerId);
          
          return (
            <div
              key={invoice.id}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {customer?.name || 'Unknown Customer'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                    <span>Due: {formatDate(invoice.dueDate)}</span>
                    <span>Created: {formatDate(invoice.createdAt)}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatCurrency(invoice.total)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    {invoice.status === 'sent' && (
                      <button
                        onClick={() => onPayInvoice(invoice)}
                        className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {invoices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-500 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Create your first invoice to get started</p>
        </div>
      )}
    </div>
  );
};

export default Invoices;