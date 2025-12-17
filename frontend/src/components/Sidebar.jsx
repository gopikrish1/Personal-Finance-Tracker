import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  User, 
  Users,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: Receipt, label: 'Transactions' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/users', icon: Users, label: 'Users' });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-64 h-full bg-white/80 backdrop-blur-md border-r border-slate-200/60 shadow-sm z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8">
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Finance Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-1">Personal Finance Management</p>
          </div>

          {/* Navigation */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Navigation
              </h3>
            </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                    <item.icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
          </div>
          
          {/* User Info */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="px-4 py-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Current User</p>
              <p className="text-sm font-medium text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</p>
            </div>
          </div>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;