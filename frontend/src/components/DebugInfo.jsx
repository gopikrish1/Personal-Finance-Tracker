import React from 'react';

const DebugInfo = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-200/60 text-xs">
      <p className="font-semibold text-slate-800 mb-2">Debug Info:</p>
      <p className="text-slate-600">API URL: {API_URL}</p>
      <p className="text-slate-600">Environment: {import.meta.env.MODE}</p>
    </div>
  );
};

export default DebugInfo; 