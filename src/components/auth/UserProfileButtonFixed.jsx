import React from 'react';
import { useAuthContext } from '../../contexts/AuthContextV2';
import Button from '../ui/Button';

export default function UserProfileButton({ onLoginClick }) {
  const { user, logout, credits, isLoadingCredits, refreshCredits } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close the menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.profile-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Refresh credits ONLY when the component mounts or user changes
  React.useEffect(() => {
    console.log('UserProfileButton: user or refreshCredits changed');
    
    // Manually refresh credits when the component mounts if the user is logged in
    if (user && refreshCredits) {
      console.log('Refreshing credits on mount or user change');
      refreshCredits();
    }
  }, [user, refreshCredits]);
  
  // Separate effect for logging only - doesn't trigger refreshes
  React.useEffect(() => {
    console.log('Credits updated:', credits);
  }, [credits]);
  
  // Normalize credits format to handle all possible structures
  const normalizedCredits = React.useMemo(() => {
    if (!credits) return { free: 0, paid: 0, total: 0 };
    
    // If credits is already an object with correct structure
    if (typeof credits === 'object') {
      return {
        free: credits.free || credits.freeCredits || 0,
        paid: credits.paid || credits.paidCredits || 0,
        total: (credits.total) || 
               ((credits.free || credits.freeCredits || 0) + 
               (credits.paid || credits.paidCredits || 0))
      };
    }
    
    // If credits is a number (old format)
    if (typeof credits === 'number') {
      return { free: 0, paid: credits, total: credits };
    }
    
    return { free: 0, paid: 0, total: 0 };
  }, [credits]);

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-start mr-2">
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            <span className="text-xs font-medium">Free: {isLoadingCredits ? '...' : normalizedCredits.free}</span>
          </div>
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium">Paid: {isLoadingCredits ? '...' : normalizedCredits.paid}</span>
          </div>
        </div>
        <Button
          onClick={onLoginClick}
          size="sm"
          variant="outline"
          className="flex items-center justify-center border-purple-400/50 min-w-[80px]"
          disabled={isLoading}
        >
          <div className="flex items-center justify-center">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mr-1"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
            <span>{isLoading ? 'Please wait...' : 'Login'}</span>
          </div>
        </Button>
      </div>
    );
  }

  // User is logged in - Show both credits AND profile button
  return (
    <div className="flex items-center space-x-3">
      {/* Credits for logged in user */}
      <div className="flex flex-col items-start">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <span className="text-xs font-medium">Free: {isLoadingCredits ? '...' : normalizedCredits.free}</span>
        </div>
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Paid: {isLoadingCredits ? '...' : normalizedCredits.paid}</span>
        </div>
      </div>
      
      {/* Profile menu */}
      <div className="relative profile-menu">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-1 rounded-full bg-white/10 p-1 pr-2 text-sm font-medium shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium overflow-hidden">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || user.email} 
                className="h-full w-full object-cover"
              />
            ) : (
              user.displayName?.[0] || user.email?.[0] || '?'
            )}
          </div>
          <span className="hidden sm:inline-block">{user.displayName || user.email.split('@')[0]}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-10">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{user.displayName || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Credits</p>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
                    <p className="text-md font-bold text-purple-600 dark:text-purple-400">
                      {isLoadingCredits ? '...' : normalizedCredits.total}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshCredits();
                  }}
                  className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                  disabled={isLoadingCredits}
                >
                  {isLoadingCredits ? (
                    <div className="w-4 h-4 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <p>Free: {normalizedCredits.free} (resets daily)</p>
                <p>Paid: {normalizedCredits.paid}</p>
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
