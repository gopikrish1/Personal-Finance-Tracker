import React, { useState } from 'react';
import { X } from 'lucide-react';

const TransactionForm = ({ transaction, onSave, onCancel, isReadOnly }) => {
  const [formData, setFormData] = useState({
    amount: transaction?.amount || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    description: transaction?.description || '',
    date: transaction?.date ? transaction.date.split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Other'],
    expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('TransactionForm handleSubmit called');
    if (isReadOnly) return;
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    console.log('Calling onSave with:', transactionData);
    onSave(transactionData);
  };

  const handleChange = (e) => {
    if (isReadOnly) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border border-slate-200/60 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              placeholder="0.00"
              step="0.01"
              required
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select-field"
              required
              disabled={isReadOnly}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select-field"
              required
              disabled={isReadOnly}
            >
              <option value="">Select Category</option>
              {categories[formData.type].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter description"
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              required
              disabled={isReadOnly}
            />
          </div>

          {!isReadOnly && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                {transaction ? 'Update' : 'Add'} Transaction
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;