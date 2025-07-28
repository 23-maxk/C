import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EstimatePublicView from './EstimatePublicView';

const EstimatePublicViewWrapper: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Estimate Link
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <EstimatePublicView 
      token={token} 
      onClose={() => navigate('/')} 
    />
  );
};

export default EstimatePublicViewWrapper;