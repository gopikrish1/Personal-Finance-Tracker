import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Calendar, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [activeChart, setActiveChart] = useState('category');

  const API_URL = import.meta.env.VITE_API_URL || 'https://techbridgefinancetrack.onrender.com/api';

  useEffect(() => {
    fetchTransactions();
  }, [timeRange]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        params: { timeRange }
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryData = useMemo(() => {
    const expensesByCategory = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        expensesByCategory[transaction.category] = 
          (expensesByCategory[transaction.category] || 0) + transaction.amount;
      });

    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: [
            '#3B82F6', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6',
            '#10B981', '#F97316', '#84CC16', '#06B6D4', '#EC4899'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [transactions]);

  const monthlyTrendData = useMemo(() => {
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      
      monthlyData[month][transaction.type] += transaction.amount;
    });

    const months = Object.keys(monthlyData).sort();
    const incomeData = months.map(month => monthlyData[month].income);
    const expenseData = months.map(month => monthlyData[month].expense);

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [transactions]);

  const incomeVsExpenseData = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          label: 'Amount',
          data: [totalIncome, totalExpense],
          backgroundColor: ['#10B981', '#EF4444'],
          borderColor: ['#059669', '#DC2626'],
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ₹${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600 mt-1">Visualize your financial data</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select-field min-w-0"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Chart Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveChart('category')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeChart === 'category'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PieChart size={16} />
            <span>Category Breakdown</span>
          </button>
          
          <button
            onClick={() => setActiveChart('trend')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeChart === 'trend'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp size={16} />
            <span>Monthly Trends</span>
          </button>
          
          <button
            onClick={() => setActiveChart('comparison')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeChart === 'comparison'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 size={16} />
            <span>Income vs Expenses</span>
          </button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="card">
        <div className="h-96">
          {activeChart === 'category' && categoryData.labels.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Expenses by Category
              </h2>
              <Pie data={categoryData} options={pieOptions} />
            </div>
          )}
          
          {activeChart === 'trend' && monthlyTrendData.labels.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Income vs Expenses Trend
              </h2>
              <Line data={monthlyTrendData} options={chartOptions} />
            </div>
          )}
          
          {activeChart === 'comparison' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Income vs Expenses Comparison
              </h2>
              <Bar data={incomeVsExpenseData} options={chartOptions} />
            </div>
          )}

          {transactions.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-lg">No data available</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add some transactions to see analytics
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Average Transaction</h3>
            <p className="text-2xl font-bold">
              ₹{(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2)}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Based on {transactions.length} transactions
            </p>
          </div>

          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Highest Income</h3>
            <p className="text-2xl font-bold">
              ₹{Math.max(...transactions.filter(t => t.type === 'income').map(t => t.amount), 0).toFixed(2)}
            </p>
            <p className="text-green-100 text-sm mt-1">
              Single transaction record
            </p>
          </div>

          <div className="card bg-gradient-to-r from-red-500 to-red-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Highest Expense</h3>
            <p className="text-2xl font-bold">
              ₹{Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0).toFixed(2)}
            </p>
            <p className="text-red-100 text-sm mt-1">
              Single transaction record
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;