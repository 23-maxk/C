import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  CreditCard, 
  Receipt, 
  BarChart3,
  Settings,
  Plus,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Camera
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

import { Settings as SettingsType } from '../utils/types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'financial' | 'jobs' | 'customers' | 'invoices' | 'payments' | 'expenses' | 'reports' | 'calendar' | 'estimates' | 'photo-reports' | 'settings' | 'customer-profile';
  onTabChange: (tab: 'dashboard' | 'financial' | 'jobs' | 'customers' | 'invoices' | 'payments' | 'expenses' | 'reports' | 'calendar' | 'estimates' | 'photo-reports' | 'settings') => void;
  settings: SettingsType;
  onBackToDashboard?: () => void;
  showNavigation?: boolean;
  onNewJob: () => void;
  onNewCustomer: () => void;
  onNewInvoice: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange, 
  settings,
  onBackToDashboard,
  showNavigation = true,
  onNewJob, 
  onNewCustomer, 
  onNewInvoice 
}) => {
  const navigate = useNavigate();
  const [showQuickActions, setShowQuickActions] = React.useState(false);

  const businessTabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, section: 'business' },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar, section: 'business' },
    { id: 'jobs' as const, label: 'Jobs', icon: Briefcase, section: 'business' },
    { id: 'customers' as const, label: 'Customers', icon: Users, section: 'business' },
    { id: 'estimates' as const, label: 'Estimates', icon: FileText, section: 'business' },
    { id: 'photo-reports' as const, label: 'Photos', icon: Camera, section: 'business' },
  ];

  const financialTabs = [
    { id: 'financial' as const, label: 'Financial Insights', icon: DollarSign, section: 'financial' },
  ];

  const systemTabs = [
    { id: 'settings' as const, label: 'Settings', icon: Settings, section: 'system' },
  ];

  const quickActions = [
    { 
      label: 'New Customer', 
      action: onNewCustomer,
      description: 'Add a new customer to your database'
    },
    { 
      label: 'New Task', 
      action: () => console.log('Add Task clicked') 
    },
  ];

  const isFinancialSection = ['financial', 'invoices', 'payments', 'expenses', 'reports'].includes(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                  {settings.companyLogo ? (
                    <img 
                      src={settings.companyLogo} 
                      alt="Company Logo" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{settings.companyName}</h1>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for transactions, contacts, reports, help and more"
                  className="w-96 pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Quick Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-6 h-6 rounded-full transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-3 h-3" />
                </button>
                
                {showQuickActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          action.action();
                          setShowQuickActions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-2"
                      >
                        <span className="font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Settings Button */}
              <button
                onClick={() => onTabChange('settings')}
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {showNavigation && (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-6">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {/* Business Section */}
              <div className="flex items-center space-x-1 py-2">
                {businessTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="font-medium text-xs">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

              {/* Financial Section */}
              <div className="flex items-center space-x-1 py-2">
                {financialTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="font-medium text-xs">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Separator */}
              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

              {/* System Section */}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="px-4 py-4">
        {children}
      </main>
      
      {/* Click outside to close dropdown */}
      {showQuickActions && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </div>
  );
};

export default Layout;