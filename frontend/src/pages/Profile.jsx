import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the user profile via API
    console.log('Profile update:', formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'read-only':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {user?.name}
            </h2>
            
            <p className="text-gray-600 mb-4">{user?.email}</p>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleBadgeColor(user?.role)}`}>
              <Shield size={14} className="mr-1" />
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center space-x-2"
                  disabled={user?.role === 'read-only'}
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <div className="input-field bg-gray-50 text-gray-700">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your email"
                      required
                    />
                  ) : (
                    <div className="input-field bg-gray-50 text-gray-700">
                      {user?.email}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield size={16} className="inline mr-2" />
                  Account Role
                </label>
                <div className="input-field bg-gray-50 text-gray-700 capitalize">
                  {user?.role}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Your account role determines your access permissions
                </p>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Role Permissions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Role Permissions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h4 className="font-medium text-gray-800">Admin</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full access to all features</li>
              <li>• Manage all users</li>
              <li>• View all transactions</li>
              <li>• System configuration</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h4 className="font-medium text-gray-800">User</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Manage own transactions</li>
              <li>• View personal analytics</li>
              <li>• Edit profile information</li>
              <li>• Full CRUD operations</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <h4 className="font-medium text-gray-800">Read-only</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View own transactions</li>
              <li>• View personal analytics</li>
              <li>• No editing permissions</li>
              <li>• Read-only access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;