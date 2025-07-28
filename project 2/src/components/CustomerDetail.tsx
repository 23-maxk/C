import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  User, 
  Plus, 
  FileText, 
  DollarSign, 
  Calendar,
  Camera,
  Edit,
  Star
} from 'lucide-react';
import { Customer, Job, Invoice, Payment, PhotoReport, Estimate, CalendarEvent } from '../utils/types';

interface CustomerDetailProps {
  customer: Customer;
  jobs: Job[];
  invoices: Invoice[];
  payments: Payment[];
  photoReports: PhotoReport[];
  estimates: Estimate[];
  calendarEvents: CalendarEvent[];
  isFullScreen?: boolean;
  onEditCustomer: (customer: Customer) => void;
  onSendEmail: (customer: Customer) => void;
  onAddNote: (customer: Customer) => void;
  onCreateEstimate: (customerId: string) => void;
  onOpenEstimateCreator: (customer: Customer) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customer,
  jobs,
  invoices,
  payments,
  photoReports,
  estimates,
  calendarEvents,
  isFullScreen = false,
  onEditCustomer,
  onSendEmail,
  onAddNote,
  onCreateEstimate,
  onOpenEstimateCreator
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'invoices' | 'estimates' | 'photos'>('overview');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      case 'scheduled': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20';
      case 'paid': return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20';
      case 'sent': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-500/20';
    }
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'sent');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {customer.type === 'commercial' ? (
                <Building className="w-8 h-8" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
              {customer.company && (
                <p className="text-gray-600 dark:text-gray-400">{customer.company}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {customer.type} • {customer.category}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSendEmail(customer)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => onEditCustomer(customer)}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {customer.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{customer.email}</p>
              </div>
            </div>
          )}
          
          {customer.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium text-gray-900 dark:text-white">{customer.phone}</p>
              </div>
            </div>
          )}
          
          {customer.address && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customer.address.street}, {customer.address.city}, {customer.address.state} {customer.address.zip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingInvoices.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Invoices</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <Camera className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{photoReports.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Photo Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onOpenEstimateCreator(customer)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Create Estimate</span>
          </button>
          <button
            onClick={() => onCreateEstimate(customer.id)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Job</span>
          </button>
          <button
            onClick={() => onAddNote(customer)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'jobs', label: `Jobs (${jobs.length})` },
              { id: 'invoices', label: `Invoices (${invoices.length})` },
              { id: 'estimates', label: `Estimates (${estimates.length})` },
              { id: 'photos', label: `Photos (${photoReports.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(job.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      Created {formatDate(job.createdAt)}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(job.estimatedValue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{invoice.invoiceNumber}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      Due {formatDate(invoice.dueDate)}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'estimates' && (
            <div className="space-y-4">
              {estimates.map((estimate) => (
                <div key={estimate.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{estimate.estimateNumber}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(estimate.status)}`}>
                      {estimate.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{estimate.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      Valid until {formatDate(estimate.validUntil)}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(estimate.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              {photoReports.map((report) => (
                <div key={report.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{report.title}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {report.photos.length} photos
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{report.description}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    Created {formatDate(report.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;