import React, { useState } from 'react';
import { X, Building, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { BankAccount } from '../utils/types';

interface BankConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (bankData: Omit<BankAccount, 'id' | 'lastSynced'>) => void;
}

const BankConnectionModal: React.FC<BankConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [step, setStep] = useState<'select' | 'credentials' | 'verify'>('select');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    accountNumber: '',
    routingNumber: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const popularBanks = [
    { id: 'chase', name: 'Chase Bank', logo: '🏦' },
    { id: 'bofa', name: 'Bank of America', logo: '🏛️' },
    { id: 'wells', name: 'Wells Fargo', logo: '🏪' },
    { id: 'citi', name: 'Citibank', logo: '🏢' },
    { id: 'usbank', name: 'US Bank', logo: '🏦' },
    { id: 'pnc', name: 'PNC Bank', logo: '🏛️' },
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bankData: Omit<BankAccount, 'id' | 'lastSynced'> = {
      name: `${selectedBank} Checking`,
      type: 'checking',
      balance: Math.floor(Math.random() * 50000) + 10000,
      isActive: true,
      accountNumber: credentials.accountNumber,
      routingNumber: credentials.routingNumber,
      isConnected: true
    };
    
    onConnect(bankData);
    setIsConnecting(false);
    setStep('select');
    setSelectedBank('');
    setCredentials({ username: '', password: '', accountNumber: '', routingNumber: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connect Bank Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <Building className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Your Bank
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect your bank account to automatically sync transactions and track expenses
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {popularBanks.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank.name);
                      setStep('credentials');
                    }}
                    className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-2xl">{bank.logo}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bank.name}</span>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Bank-level Security</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Your banking credentials are encrypted and never stored on our servers. 
                      We use read-only access to sync your transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'credentials' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Connect to {selectedBank}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your banking credentials to establish a secure connection
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Online Banking Username
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={credentials.accountNumber}
                      onChange={(e) => setCredentials({ ...credentials, accountNumber: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={credentials.routingNumber}
                      onChange={(e) => setCredentials({ ...credentials, routingNumber: e.target.value })}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Routing number"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900 dark:text-amber-100">Demo Mode</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      This is a demonstration. In production, this would connect to your actual bank 
                      through secure APIs like Plaid or Yodlee.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setStep('select')}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConnect}
                  disabled={!credentials.username || !credentials.password || !credentials.accountNumber || !credentials.routingNumber || isConnecting}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                    !credentials.username || !credentials.password || !credentials.accountNumber || !credentials.routingNumber || isConnecting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                  }`}
                >
                  {isConnecting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isConnecting ? 'Connecting...' : 'Connect Account'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankConnectionModal;