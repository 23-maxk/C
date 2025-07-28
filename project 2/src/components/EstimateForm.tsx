import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Calculator, FileText, Mail } from 'lucide-react';
import { Estimate, EstimateItem, Customer, Product } from '../utils/types';

interface EstimateFormProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  settings: Settings;
  preSelectedCustomerId?: string;
  onSave: (estimate: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onGeneratePDF: (estimate: Estimate) => void;
  onSendEmail: (estimate: Estimate) => void;
}

const EstimateForm: React.FC<EstimateFormProps> = ({
  isOpen,
  onClose,
  customers,
  products,
  settings,
  preSelectedCustomerId,
  onSave,
  onGeneratePDF,
  onSendEmail
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    estimateNumber: `EST-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    title: '',
    description: '',
    status: 'draft' as Estimate['status'],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax: 0.08,
    notes: '',
    terms: 'This estimate is valid for 30 days from the date issued.'
  });

  const [items, setItems] = useState<EstimateItem[]>([
    {
      id: '1',
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  // Pre-select customer when coming from customer profile
  React.useEffect(() => {
    if (preSelectedCustomerId && isOpen) {
      const customer = customers.find(c => c.id === preSelectedCustomerId);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerId: preSelectedCustomerId,
          customerName: customer.name
        }));
      }
    }
  }, [preSelectedCustomerId, isOpen, customers]);

  const addItem = () => {
    const newItem: EstimateItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<EstimateItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        // In a real implementation, you would use jsPDF or similar to create PDF with company branding
        console.log('Generating PDF with company info:', {
          companyName: settings.companyName,
          companyLogo: settings.companyLogo,
          items: items.length
        });
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const addProductToItems = (product: Product) => {
    const newItem: EstimateItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name,
      description: product.description,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
      category: product.category
    };
    setItems([...items, newItem]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * formData.tax;
  const total = subtotal + taxAmount;

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || ''
    });
  };

  const handleSave = async () => {
    if (!formData.customerId || items.some(item => !item.name.trim())) return;
    
    setIsSaving(true);
    
    const estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      validUntil: new Date(formData.validUntil),
      items: items.filter(item => item.name.trim()),
      subtotal,
      tax: taxAmount,
      total
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(estimateData);
    
    // Reset form
    setFormData({
      customerId: '',
      customerName: '',
      estimateNumber: `EST-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      title: '',
      description: '',
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tax: 0.08,
      notes: '',
      terms: 'This estimate is valid for 30 days from the date issued.'
    });
    setItems([{
      id: '1',
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Estimate</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimate Number
              </label>
              <input
                type="text"
                value={formData.estimateNumber}
                onChange={(e) => setFormData({ ...formData, estimateNumber: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid Until
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Roof Replacement Estimate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.tax * 100}
                onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) / 100 || 0 })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Brief description of the work to be performed..."
            />
          </div>

          {/* Quick Add Products */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Add Products
            </label>
            <div className="flex flex-wrap gap-2">
              {products.filter(p => p.isActive).slice(0, 6).map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProductToItems(product)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {product.name} - ${product.price}
                </button>
              ))}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Line Items</h3>
              <button
                onClick={addItem}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="col-span-12 md:col-span-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Item name"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Unit Price"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-1 flex items-center">
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Estimate Total</h3>
            </div>
            
            {/* Company Branding Preview */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                {settings.companyLogo && (
                  <img 
                    src={settings.companyLogo} 
                    alt="Company Logo" 
                    className="w-8 h-8 object-contain"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{settings.companyName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This branding will appear on the PDF</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax ({(formData.tax * 100).toFixed(1)}%):</span>
                <span className="font-medium text-gray-900 dark:text-white">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Additional notes for the customer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={4}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Terms and conditions..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={!formData.customerId || items.some(item => !item.name.trim()) || isSaving}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                !formData.customerId || items.some(item => !item.name.trim()) || isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25'
              }`}
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              <span>{isSaving ? 'Creating...' : 'Save Estimate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateForm;