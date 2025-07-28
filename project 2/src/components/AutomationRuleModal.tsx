import React, { useState } from 'react';
import { X, Save, Zap, Plus, Trash2 } from 'lucide-react';
import { AutomationRule } from '../utils/types';

interface AutomationRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<AutomationRule, 'id' | 'createdAt'>) => void;
}

const AutomationRuleModal: React.FC<AutomationRuleModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    conditions: {
      amountMin: undefined as number | undefined,
      amountMax: undefined as number | undefined,
      descriptionContains: '',
      vendor: '',
      transactionType: 'both' as 'debit' | 'credit' | 'both'
    },
    actions: {
      category: '',
      createExpense: true,
      assignToJob: '',
      notes: ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Materials',
    'Labor',
    'Equipment',
    'Fuel',
    'Office Supplies',
    'Insurance',
    'Utilities',
    'Marketing',
    'Professional Services',
    'Travel',
    'Meals & Entertainment',
    'Other'
  ];

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.actions.category) return;
    
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ruleData: Omit<AutomationRule, 'id' | 'createdAt'> = {
      ...formData,
      conditions: {
        ...formData.conditions,
        amountMin: formData.conditions.amountMin || undefined,
        amountMax: formData.conditions.amountMax || undefined,
        descriptionContains: formData.conditions.descriptionContains || undefined,
        vendor: formData.conditions.vendor || undefined
      }
    };
    
    onSave(ruleData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      isActive: true,
      conditions: {
        amountMin: undefined,
        amountMax: undefined,
        descriptionContains: '',
        vendor: '',
        transactionType: 'both'
      },
      actions: {
        category: '',
        createExpense: true,
        assignToJob: '',
        notes: ''
      }
    });
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Automation Rule</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rule Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Auto-categorize fuel expenses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transaction Type
                </label>
                <select
                  value={formData.conditions.transactionType}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, transactionType: e.target.value as any }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="both">Both Debit & Credit</option>
                  <option value="debit">Debit Only</option>
                  <option value="credit">Credit Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe what this rule does..."
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">When Transaction Matches</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.conditions.amountMin || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, amountMin: parseFloat(e.target.value) || undefined }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.conditions.amountMax || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, amountMax: parseFloat(e.target.value) || undefined }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description Contains
                </label>
                <input
                  type="text"
                  value={formData.conditions.descriptionContains}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, descriptionContains: e.target.value }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Shell, Home Depot, Starbucks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor Name
                </label>
                <input
                  type="text"
                  value={formData.conditions.vendor}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, vendor: e.target.value }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Exact vendor name"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Then Automatically</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categorize As *
                </label>
                <select
                  value={formData.actions.category}
                  onChange={(e) => setFormData({
                    ...formData,
                    actions: { ...formData.actions, category: e.target.value }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to Job (Optional)
                </label>
                <input
                  type="text"
                  value={formData.actions.assignToJob}
                  onChange={(e) => setFormData({
                    ...formData,
                    actions: { ...formData.actions, assignToJob: e.target.value }
                  })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Job ID or name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Notes (Optional)
              </label>
              <input
                type="text"
                value={formData.actions.notes}
                onChange={(e) => setFormData({
                  ...formData,
                  actions: { ...formData.actions, notes: e.target.value }
                })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Automatic note to add to expense"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="createExpense"
                checked={formData.actions.createExpense}
                onChange={(e) => setFormData({
                  ...formData,
                  actions: { ...formData.actions, createExpense: e.target.checked }
                })}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="createExpense" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Automatically create expense record
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rule is active
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Rule Preview</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              When a {formData.conditions.transactionType === 'both' ? 'transaction' : formData.conditions.transactionType} 
              {formData.conditions.amountMin && ` over $${formData.conditions.amountMin}`}
              {formData.conditions.amountMax && ` under $${formData.conditions.amountMax}`}
              {formData.conditions.descriptionContains && ` containing "${formData.conditions.descriptionContains}"`}
              {formData.conditions.vendor && ` from ${formData.conditions.vendor}`}
              {' '}is detected, it will be automatically categorized as "{formData.actions.category || 'selected category'}"
              {formData.actions.createExpense && ' and an expense record will be created'}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name.trim() || !formData.actions.category || isSaving}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !formData.name.trim() || !formData.actions.category || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Creating...' : 'Create Rule'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationRuleModal;