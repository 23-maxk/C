import React from 'react';
import { CreditCard, Plus, Search, Filter, CheckCircle } from 'lucide-react';
import { Payment, Invoice, Customer } from '../utils/types';

interface PaymentsProps {
  payments: Payment[];
  invoices: Invoice[];
  customers: Customer[];
  onNewPayment: () => void;
}

const Payments: React.FC<PaymentsProps> = ({ 
  payments, 
  invoices, 
  customers, 
  onNewPayment 
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
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'pending': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
      case 'refunded': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments</h2>
          <p className="text-gray-600 dark:text-gray-400">Track all payment transactions</p>
        </div>
        <button
          onClick={onNewPayment}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.map((payment) => {
          const customer = customers.find(c => c.id === payment.customerId);
          const invoice = payment.invoiceId ? invoices.find(i => i.id === payment.invoiceId) : null;
          
          return (
            <div
              key={payment.id}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(payment.status)}`}>
                    {payment.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      getMethodIcon(payment.method)
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {customer?.name || 'Unknown Customer'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                      <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{formatDate(payment.date)}</span>
                      {invoice && (
                        <>
                          <span>•</span>
                          <span>{invoice.invoiceNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
              
              {payment.notes && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{payment.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-500 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Payments will appear here once processed</p>
        </div>
      )}
    </div>
  );
};

export default Payments;