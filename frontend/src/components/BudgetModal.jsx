import React, { useState, useEffect } from 'react';

const BudgetModal = ({ isOpen, onClose, onSubmit, budget, categories }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
      });
    } else {
      setFormData({
        category: categories[0] || '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    }
  }, [budget, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'month') {
      const num = parseInt(value, 10);
      if (num < 1) return setFormData((prev) => ({ ...prev, month: 1 }));
      if (num > 12) return setFormData((prev) => ({ ...prev, month: 12 }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, budget?._id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {budget ? 'Edit Budget' : 'Add Budget'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Month */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Month</label>
            <input
              type="number"
              name="month"
              value={formData.month}
              onChange={handleChange}
              min="1"
              max="12"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Year */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="2000"
              max="2100"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {budget ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
