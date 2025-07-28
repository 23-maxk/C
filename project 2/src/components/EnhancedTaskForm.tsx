import React, { useState } from 'react';
import { X, Save, Clock, User, MapPin, Calendar, Briefcase, Phone, UserCheck, FileText, DollarSign, Users, AlertCircle } from 'lucide-react';
import { CalendarEvent, Job, Customer } from '../utils/types';

interface EnhancedTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  customers: Customer[];
  taskType: CalendarEvent['type'] | null;
  teamMembers: { id: string; name: string; color: string }[];
  onSave: (task: Omit<CalendarEvent, 'id'>) => void;
}

const EnhancedTaskForm: React.FC<EnhancedTaskFormProps> = ({ 
  isOpen, 
  onClose, 
  jobs, 
  customers, 
  taskType,
  teamMembers,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    start: new Date().toISOString().slice(0, 16),
    end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    type: taskType || 'task' as CalendarEvent['type'],
    jobId: '',
    customerId: '',
    assignedTo: [] as string[],
    subcontractors: [] as string[],
    priority: 'medium' as CalendarEvent['priority'],
    timeEstimate: 1,
    description: '',
    location: '',
    status: 'scheduled' as CalendarEvent['status']
  });

  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (taskType) {
      setFormData(prev => ({ ...prev, type: taskType }));
    }
  }, [taskType]);

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    
    setIsSaving(true);
    
    const taskData: Omit<CalendarEvent, 'id'> = {
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
      jobId: formData.jobId || undefined,
      customerId: formData.customerId || undefined,
      assignedTo: formData.assignedTo.length > 0 ? formData.assignedTo : undefined,
      subcontractors: formData.subcontractors.length > 0 ? formData.subcontractors : undefined,
      description: formData.description || undefined,
      location: formData.location || undefined
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(taskData);
    
    // Reset form
    setFormData({
      title: '',
      start: new Date().toISOString().slice(0, 16),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      type: 'task',
      jobId: '',
      customerId: '',
      assignedTo: [],
      subcontractors: [],
      priority: 'medium',
      timeEstimate: 1,
      description: '',
      location: '',
      status: 'scheduled'
    });
    setIsSaving(false);
    onClose();
  };

  const getTaskTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task': return Clock;
      case 'phone_call': return Phone;
      case 'appointment': return Calendar;
      case 'lead_followup': return UserCheck;
      case 'invoice_followup': return FileText;
      case 'estimate_followup': return DollarSign;
      default: return Clock;
    }
  };

  const getTaskTypeLabel = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task': return 'Task';
      case 'phone_call': return 'Phone Call';
      case 'appointment': return 'Appointment';
      case 'lead_followup': return 'Lead Follow Up';
      case 'invoice_followup': return 'Invoice Follow Up';
      case 'estimate_followup': return 'Estimate Follow Up';
      default: return 'Task';
    }
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter(id => id !== memberId)
        : [...prev.assignedTo, memberId]
    }));
  };

  const handleSubcontractorToggle = (contractorId: string) => {
    setFormData(prev => ({
      ...prev,
      subcontractors: prev.subcontractors.includes(contractorId)
        ? prev.subcontractors.filter(id => id !== contractorId)
        : [...prev.subcontractors, contractorId]
    }));
  };

  const subcontractors = customers?.filter(c => c.category === 'subcontractor') || [];

  if (!isOpen) return null;

  const TaskIcon = getTaskTypeIcon(formData.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <TaskIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getTaskTypeLabel(formData.type)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CalendarEvent['priority'] })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Estimate (hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={formData.timeEstimate}
                onChange={(e) => setFormData({ ...formData, timeEstimate: parseFloat(e.target.value) || 1 })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Related Job and Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Related Job (Optional)
              </label>
              <select
                value={formData.jobId}
                onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a job...</option>
                {jobs && jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer (Optional)
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a customer...</option>
                {customers && customers.filter(c => c.category === 'client').map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Members Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Assign to Team Members (Multiple Selection)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {teamMembers?.map((member) => (
                <label key={member.id} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(member.name)}
                    onChange={() => handleTeamMemberToggle(member.name)}
                    className="w-3 h-3 text-blue-600 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: member.color }}
                    />
                    <span className="text-xs text-gray-900 dark:text-white">{member.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subcontractors */}
          {subcontractors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Assign to Subcontractors (Multiple Selection)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subcontractors.map((contractor) => (
                  <label key={contractor.id} className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.subcontractors.includes(contractor.id)}
                      onChange={() => handleSubcontractorToggle(contractor.id)}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    <span className="text-xs text-gray-900 dark:text-white">{contractor.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Job site address or meeting location"
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
              rows={4}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Additional details about the task..."
            />
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
            disabled={!formData.title.trim() || isSaving}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !formData.title.trim() || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Creating...' : 'Create Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTaskForm;