import React, { useState } from 'react';
import { X, CreditCard, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { Invoice, Customer, Payment } from '../utils/types';

interface PaymentProcessorProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  customers: Customer[];
  onPaymentComplete: (payment: Omit<Payment, 'id'>) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  isOpen,
  onClose,
  invoice,
  customers,
  onPaymentComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash' | 'check' | 'bank_transfer'>('stripe');
  const [amount, setAmount] = useState(invoice?.total || 0);
  const [isSaving, setIsSaving] = useState(false);

  const customer = invoice ? customers.find(c => c.id === invoice.customerId) : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handlePayment = async () => {
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const payment: Omit<Payment, 'id'> = {
        invoiceId: invoice?.id,
        customerId: invoice?.customerId || '',
        amount,
        method: paymentMethod,
        status: 'completed',
        date: new Date(),
        notes: `${paymentMethod} payment for ${invoice?.invoiceNumber || 'manual payment'}`
      };
      
      onPaymentComplete(payment);
      
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Payment recording failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      return;
    }
    
    await handlePayment();
  };

  const resetForm = () => {
    setPaymentMethod('credit_card');
    setAmount(0);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {invoice ? `Process Payment - ${invoice.invoiceNumber}` : 'Process Payment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Invoice Details */}
          {invoice && customer && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{customer.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Amount Due:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'cash', label: 'Cash', icon: DollarSign },
                { id: 'check', label: 'Check', icon: DollarSign },
                { id: 'bank_transfer', label: 'Bank Transfer', icon: DollarSign }
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25'
              }`}
            >
              <span>
                {isSaving 
                  ? 'Processing...' 
                  : `Process ${formatCurrency(amount)}`
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentProcessor;