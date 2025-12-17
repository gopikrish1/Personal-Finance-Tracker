import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Menu, X, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
      <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Wallet size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Finance Tracker
              </h1>
              <p className="text-xs text-slate-500">Personal Finance Management</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Finance Tracker
              </h1>
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-3 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/60 z-50 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user?.name}</p>
                        <p className="text-sm text-slate-600">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                    className="w-full flex items-center space-x-3 px-6 py-4 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;