import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Jobs from './components/Jobs';
import Invoices from './components/Invoices';
import Estimates from './components/Estimates';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'jobs':
        return <Jobs />;
      case 'invoices':
        return <Invoices />;
      case 'estimates':
        return <Estimates />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </Router>
  );
}

export default App;