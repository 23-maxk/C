import React from 'react';
import { Users, Briefcase, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { mockCustomers, mockJobs, mockInvoices, mockEstimates } from '../utils/data';

const Dashboard: React.FC = () => {
  const totalCustomers = mockCustomers.length;
  const activeJobs = mockJobs.filter(job => job.status === 'in-progress').length;
  const pendingInvoices = mockInvoices.filter(invoice => invoice.status === 'sent').length;
  const totalRevenue = mockInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Jobs',
      value: activeJobs,
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Pending Invoices',
      value: pendingInvoices,
      icon: FileText,
      color: 'bg-yellow-500',
      change: '-3%'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  const recentJobs = mockJobs.slice(0, 3);
  const recentEstimates = mockEstimates.slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
            <Briefcase className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => {
              const customer = mockCustomers.find(c => c.id === job.customerId);
              return (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">${(job.estimatedHours * job.hourlyRate).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Estimates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Estimates</h2>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentEstimates.map((estimate) => {
              const customer = mockCustomers.find(c => c.id === estimate.customerId);
              return (
                <div key={estimate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{estimate.title}</h3>
                    <p className="text-sm text-gray-600">{customer?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      estimate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      estimate.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      estimate.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {estimate.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">${estimate.total.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Add New Customer</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Briefcase className="w-5 h-5 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Create New Job</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <FileText className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-medium text-purple-700">Generate Estimate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;