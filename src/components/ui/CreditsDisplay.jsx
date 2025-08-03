import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContextV2';

export default function CreditsDisplay({ showLogin }) {
  const { credits, isLoadingCredits, user, refreshCredits } = useAuthContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Only refresh credits on first mount, not on every re-render
  useEffect(() => {
    // Use a flag in sessionStorage to track if credits have been refreshed
    const hasRefreshed = sessionStorage.getItem('credits-refreshed');
    if (!hasRefreshed) {
      refreshCredits();
      sessionStorage.setItem('credits-refreshed', 'true');
    }
  }, []);
  
  // Handle credit refresh without page reload - throttled to prevent excessive API calls
  const handleRefreshCredits = async (e) => {
    e.preventDefault();
    
    // Prevent refreshing too frequently (only once per 30 seconds)
    const lastRefresh = localStorage.getItem('last-credits-refresh');
    const now = Date.now();
    
    if (lastRefresh && now - parseInt(lastRefresh, 10) < 30000) {
      // Just show the animation but don't actually refresh
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 600);
      return;
    }
    
    // Proceed with actual refresh
    setIsRefreshing(true);
    await refreshCredits();
    localStorage.setItem('last-credits-refresh', now.toString());
    setTimeout(() => setIsRefreshing(false), 600);
  };
  


  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-purple-200/20">
      <div className="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
        </svg>
        <h3 className="text-lg font-bold text-white">Credits</h3>
      </div>
      
      <div className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 transition-all ${isRefreshing ? 'scale-110' : ''}`}>
        {isLoadingCredits ? '...' : (credits?.total || (credits?.free + credits?.paid) || 0)}
      </div>
      
      <div className="text-center text-sm text-gray-300 space-y-1">
        {user && !isLoadingCredits && (
          <div className="flex flex-col gap-1">
            <p className="text-green-400">Free: {credits?.freeCredits || credits?.free || 0}</p>
            <p className="text-blue-400">Paid: {credits?.paidCredits || credits?.paid || 0}</p>
          </div>
        )}
        {!user && (
          <>
            <p>You have 10 free credits</p>
            <button 
              onClick={showLogin} 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Log in for 10 more credits
            </button>
          </>
        )}
        {user && (
          <>
            <p>You get 5 free credits daily</p>
            <p className="text-xs text-gray-400">Credits refresh at midnight</p>
          </>
        )}
        <button 
          onClick={handleRefreshCredits} 
          className="mt-2 text-xs flex items-center justify-center space-x-1 text-purple-400/60 hover:text-purple-300 opacity-60 hover:opacity-100 transition-opacity"
          disabled={isRefreshing}
          title="Only refresh if needed - updates automatically when generating images"
        >
          {isRefreshing ? (
            <span className="inline-block w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-1"></span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-[10px] opacity-80">Sync credits</span>
        </button>
        

      </div>
    </div>
  );
}
