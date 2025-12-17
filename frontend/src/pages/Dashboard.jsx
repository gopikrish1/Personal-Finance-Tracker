import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TransactionForm from '../components/TransactionForm';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    'https://techbridgefinancetrack.onrender.com/api';

  useEffect(() => {
    fetchTransactions();
  }, [timeRange]);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        params: { timeRange }
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, timeRange]);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    
    return { income, expenses, balance };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const handleSaveTransaction = useCallback(async (transactionData) => {
    try {
      if (editingTransaction) {
        await axios.put(
          `${API_URL}/transactions/${editingTransaction._id}`,
          transactionData
        );
      } else {
        await axios.post(`${API_URL}/transactions`, transactionData);
      }
      
      fetchTransactions();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }, [editingTransaction, API_URL, fetchTransactions]);

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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600 mt-2">
            Here's your financial overview for{' '}
            {timeRange === 'week'
              ? 'this week'
              : timeRange === 'month'
              ? 'this month'
              : 'this year'}
          </p>
        </div>

        <div className="relative">
          <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border rounded-xl shadow-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Income */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between mb-4">
            <div className="p-3 bg-emerald-500 rounded-xl">
              <TrendingUp size={24} className="text-white" />
            </div>
            <ArrowUpRight size={20} className="text-emerald-500" />
          </div>
          <p className="text-slate-600 text-sm">Total Income</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            ₹{stats.income.toFixed(2)}
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between mb-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <TrendingDown size={24} className="text-white" />
            </div>
            <ArrowDownRight size={20} className="text-red-500" />
          </div>
          <p className="text-slate-600 text-sm">Total Expenses</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            ₹{stats.expenses.toFixed(2)}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <DollarSign size={24} className="text-white" />
            </div>
            {stats.balance >= 0 ? (
              <ArrowUpRight size={20} className="text-emerald-500" />
            ) : (
              <ArrowDownRight size={20} className="text-red-500" />
            )}
          </div>
          <p className="text-slate-600 text-sm">Net Balance</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">
            ₹{stats.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-center text-slate-500">No transactions found</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-xl"
              >
                <div>
                  <p className="font-semibold">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-sm text-slate-500">
                    {transaction.category} •{' '}
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    transaction.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          isReadOnly={false}
        />
      )}
    </div>
  );
};

export default Dashboard;
