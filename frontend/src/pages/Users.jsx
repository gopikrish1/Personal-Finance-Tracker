import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users as UsersIcon, Shield, Edit, Trash2, Plus, UserCheck, UserX } from 'lucide-react';
import axios from 'axios';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://techbridgefinancetrack.onrender.com/api';

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'user':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'read-only':
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-600 mt-2">Manage system users and their permissions</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <UserCheck size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium">Administrators</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">
              {users.filter(u => u.role === 'admin').length}
            </p>
            <p className="text-purple-600 text-sm mt-2">Full system access</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <UsersIcon size={24} className="text-white" />
            </div>
            <UserCheck size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium">Regular Users</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">
              {users.filter(u => u.role === 'user').length}
            </p>
            <p className="text-blue-600 text-sm mt-2">Standard access</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <UserX size={20} className="text-slate-500" />
          </div>
          <div>
            <p className="text-slate-600 text-sm font-medium">Read-only Users</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">
              {users.filter(u => u.role === 'read-only').length}
            </p>
            <p className="text-slate-600 text-sm mt-2">View-only access</p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">All Users</h2>
              <p className="text-slate-600 text-sm mt-1">Manage user accounts and permissions</p>
            </div>
            <div className="text-slate-400">
              <UsersIcon size={24} />
            </div>
          </div>
        </div>

        <div className="p-6">
        {users.length === 0 ? (
          <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No users found</p>
              <p className="text-slate-500 text-sm mt-1">
                Start by adding your first user to the system
              </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Joined</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData, index) => (
                  <tr 
                    key={userData._id} 
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'
                    }`}
                  >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-sm">
                            {userData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{userData.name}</p>
                            <p className="text-sm text-slate-500">ID: {userData._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                      <td className="py-4 px-6 text-slate-600">
                      {userData.email}
                    </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(userData.role)}`}>
                        <Shield size={12} className="mr-1" />
                        {userData.role}
                      </span>
                    </td>
                      <td className="py-4 px-6 text-slate-600">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </td>
                      <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(userData);
                            setShowForm(true);
                          }}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Edit size={16} />
                        </button>
                        {userData._id !== user._id && (
                          <button
                            onClick={() => handleDeleteUser(userData._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Users;