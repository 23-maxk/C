import React, { useState } from 'react';
import { LayoutDashboard, Users, Briefcase, FileText, Calculator } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">BusinessFlow</h1>
          <p className="text-gray-600">Complete Business Management System</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'jobs', label: 'Jobs', icon: Briefcase },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'estimates', label: 'Estimates', icon: Calculator },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$1,275</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
              <p className="text-gray-600 mt-2">Manage your customer relationships</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Customer management features coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Jobs</h2>
              <p className="text-gray-600 mt-2">Track and manage all your projects</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Job management features coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Invoices</h2>
              <p className="text-gray-600 mt-2">Manage your billing and payments</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Invoice management features coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'estimates' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Estimates</h2>
              <p className="text-gray-600 mt-2">Create and manage project estimates</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Estimate management features coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;