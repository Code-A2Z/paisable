import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import useCurrency from '../hooks/useCurrency';
import BudgetModal from '../components/BudgetModal';
import EmptyState from '../components/EmptyState';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState('');
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/transactions/categories/expense'),
        api.get('/transactions'),
      ]);
      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data);
      setTransactions(transactionsRes.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch budgets or transactions', error);
      setError('Failed to load budgets. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Budget alerts - auto calculates
  useEffect(() => {
    const alerts = budgets.map(budget => {
      const spent = calculateSpent(budget);
      const percent = (spent / budget.amount) * 100;
      if (percent > 100) {
        return {
          message: `🚨 OVER BUDGET: ${budget.category} exceeded by ${(percent-100).toFixed(1)}%`,
          type: 'error'
        };
      }
      if (percent > 80) {
        return {
          message: `⚠️ WARNING: ${budget.category} at ${percent.toFixed(1)}% of budget`,
          type: 'warning'
        };
      }
      return null;
    }).filter(alert => alert);
    
    setBudgetAlerts(alerts);
  }, [budgets, transactions]);

  const handleOpenBudgetModal = (budget = null) => {
    setEditingBudget(budget);
    setIsBudgetModalOpen(true);
  };

  const handleCloseBudgetModal = () => {
    setIsBudgetModalOpen(false);
    setEditingBudget(null);
  };

  const handleFormSubmit = async (formData, id) => {
    try {
      setError('');
      if (id) await api.put(`/budgets/${id}`, formData);
      else await api.post('/budgets', formData);
      fetchData();
      handleCloseBudgetModal();
    } catch (error) {
      console.error('Failed to save budget', error);
      setError('Failed to save budget. Please try again.');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        setError('');
        await api.delete(`/budgets/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete budget', error);
        setError('Failed to delete budget. Please try again.');
      }
    }
  };

  const calculateSpent = (budget) => {
    return transactions
      .filter((tx) => {
        const txDate = new Date(tx.addedOn);
        return (
          tx.category === budget.category &&
          txDate.getMonth() + 1 === budget.month &&
          txDate.getFullYear() === budget.year
        );
      })
      .reduce((sum, tx) => sum + tx.cost, 0);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleOpenBudgetModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Budget
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Budget Alerts */}
      {budgetAlerts.map((alert, index) => (
        <div 
          key={index} 
          className={`mb-3 p-3 rounded-lg border ${
            alert.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <div className="flex items-center">
            <span className="font-semibold">{alert.message}</span>
          </div>
        </div>
      ))}

      {loading ? (
        <Spinner />
      ) : budgets.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-x-auto hover:shadow-lg transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgets.map((b) => {
                const spent = calculateSpent(b);
                const remaining = b.amount - spent;
                const percent = Math.min((spent / b.amount) * 100, 100).toFixed(1);

                return (
                  <tr key={b._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {b.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{`${b.month}/${b.year}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency.code,
                      }).format(b.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency.code,
                      }).format(spent)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold ${
                        remaining >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: currency.code,
                      }).format(remaining)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-1/3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            percent < 80
                              ? 'bg-green-500'
                              : percent < 100
                              ? 'bg-yellow-500'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{percent}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenBudgetModal(b)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(b._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <BudgetModal
            isOpen={isBudgetModalOpen}
            onClose={handleCloseBudgetModal}
            onSubmit={handleFormSubmit}
            budget={editingBudget}
            categories={categories}
          />
        </div>
      ) : (
        <div className="p-6 bg-white shadow rounded-lg">
          <EmptyState message="No budgets found" />
        </div>
      )}
    </>
  );
};

export default Budgets;