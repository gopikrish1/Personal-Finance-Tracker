import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TransactionForm from '../components/TransactionForm';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'https://techbridgefinancetrack.onrender.com/api';
  const ITEMS_PER_PAGE = 10;

  // Fix: Admin users should be able to add transactions
  const canAddTransaction = user?.role === 'admin' || user?.role === 'user';

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm, filterType, filterCategory]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          type: filterType === 'all' ? undefined : filterType,
          category: filterCategory === 'all' ? undefined : filterCategory
        }
      });
      
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = useCallback(async (transactionData) => {
    try {
      if (editingTransaction) {
        await axios.put(`${API_URL}/transactions/${editingTransaction._id}`, transactionData);
      } else {
        await axios.post(`${API_URL}/transactions`, transactionData);
      }
      
      fetchTransactions();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }, [editingTransaction, API_URL]);

  const handleDeleteTransaction = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }, [API_URL]);

  const filteredTransactions = useMemo(() => {
    return transactions;
  }, [transactions]);

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Salary', 'Freelance', 'Business', 'Investment', 'Other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-slate-600 mt-1">Manage your income and expenses</p>
        </div>
        

      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter size={16} className="text-slate-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="select-field max-w-xs"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select-field max-w-xs"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">All Transactions</h2>
              <p className="text-slate-600 text-sm mt-1">Your financial activities</p>
            </div>
          </div>
        </div>

        <div className="p-6">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No transactions found</p>
              <p className="text-slate-500 text-sm mt-1">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by adding your first transaction'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Transaction</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Category</th>
                      <th className="text-left py-4 px-4 font-semibold text-slate-700">Date</th>
                      <th className="text-right py-4 px-4 font-semibold text-slate-700">Amount</th>
                      {canAddTransaction && (
                        <th className="text-right py-4 px-4 font-semibold text-slate-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction._id} 
                        className={`border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div>
                            <p className="font-semibold text-slate-800">
                              {transaction.description || transaction.category}
                            </p>
                            <p className="text-sm text-slate-500">
                              {transaction.description && transaction.category}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            transaction.type === 'income' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                          {transaction.category}
                        </span>
                      </td>
                        <td className="py-4 px-4 text-slate-600">
                          {new Date(transaction.date).toLocaleDateString()}
                      </td>
                        <td className="py-4 px-4 text-right">
                          <p className={`font-bold text-lg ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                          </p>
                        </td>
                        {canAddTransaction && (
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingTransaction(transaction);
                                setShowForm(true);
                              }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction._id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                  </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          isReadOnly={user?.role === 'read-only'}
        />
      )}
    </div>
  );
};

export default Transactions;
