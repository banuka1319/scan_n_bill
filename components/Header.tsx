import React from 'react';
import { ScanLine, LogOut } from 'lucide-react';

interface HeaderProps {
    userEmail?: string;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">BillScanner</span>
        </div>
        
        {userEmail && (
            <div className="flex items-center space-x-3">
                <div className="hidden xs:flex flex-col items-end">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">User</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 max-w-[120px] truncate">{userEmail}</span>
                </div>
                {onLogout && (
                    <button 
                        onClick={onLogout}
                        className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-500 transition-all active:scale-95"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;