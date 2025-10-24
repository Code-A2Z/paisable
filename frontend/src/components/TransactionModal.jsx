import React, { useState, useEffect } from 'react';

const VIEW_MODE = {
  EXPENSE_FORM: 'expenseForm',
  INCOME_FORM: 'incomeForm',
};

const getInitialFormData = (categories) => ({
  name: '',
  category: categories[0] || '',
  cost: '',
  addedOn: new Date().toISOString().split('T')[0],
  isIncome: false,
  note: ''
});

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, expenseCategories = [], incomeCategories = [], onNewCategory, currentBalance = 0 }) => {
  const [modalView, setModalView] = useState(VIEW_MODE.EXPENSE_FORM);
  const [submittedAnyway, setSubmittedAnyway] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost: '',
    addedOn: new Date().toISOString().split('T')[0],
    isIncome: false,
    note: ' '
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name,
        category: transaction.category,
        cost: transaction.cost,
        addedOn: new Date(transaction.addedOn).toISOString().split('T')[0],
        isIncome: transaction.isIncome,
        notes: transaction.note || ''
      });
      setModalView(transaction.isIncome ? VIEW_MODE.INCOME_FORM : VIEW_MODE.EXPENSE_FORM);
    } else {
      setFormData({
        name: '',
        category: expenseCategories[0] || '', // Default to the first category or empty
        cost: '',
        addedOn: new Date().toISOString().split('T')[0],
        isIncome: false,
      });
      if (modalView === VIEW_MODE.EXPENSE_FORM) {
        setFormData(prev => ({ ...prev, category: expenseCategories[0] || '' }));
      } else {
        setFormData(prev => ({ ...prev, category: incomeCategories[0] || '' }));
      }
    }
  }, [transaction, isOpen, expenseCategories, incomeCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle the "Add New" option for category
    if (name === 'category' && value === '__add_new__') {
      const newCategory = window.prompt("Enter new category name:");

      if (newCategory) {
        const isIncome = modalView === VIEW_MODE.INCOME_FORM;
        onNewCategory(newCategory, isIncome);

        setFormData(prev => ({ ...prev, category: newCategory }));
      }
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isIncomeTransaction = modalView === VIEW_MODE.INCOME_FORM;
    const costValue = parseFloat(formData.cost);
    if (!isIncomeTransaction && !transaction && costValue > currentBalance && !submittedAnyway) {
      const confirmation = window.confirm(
        `Warning: This expense (${costValue}) exceeds your current balance (${currentBalance}). Proceeding will result in a negative balance. Do you wish to submit anyway?`
      );

      if (confirmation) {
        setSubmittedAnyway(true);
        setTimeout(() => {
          e.target.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 0);
      }
      return;
    }
    setSubmittedAnyway(false);
    let transactionName = formData.name.trim();
    if (isIncomeTransaction && transactionName === '') {
      transactionName = (formData.category ? formData.category : 'General') + ' Income';
    }
    const finalFormData = {
      ...formData,
      name: transactionName,
      isIncome: modalView === VIEW_MODE.INCOME_FORM
    };
    onSubmit(finalFormData, transaction?._id);
  };

  const handleSwitchToIncome = (e) => {
    e.preventDefault();
    setFormData(getInitialFormData(incomeCategories));
    setModalView(VIEW_MODE.INCOME_FORM);
  }

  const handleSwitchToExpense = (e) => {
    e.preventDefault();
    setFormData(getInitialFormData(expenseCategories));
    setModalView(VIEW_MODE.EXPENSE_FORM);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{transaction ? 'Edit' : 'Add'}{modalView === VIEW_MODE.EXPENSE_FORM ? ' Expense' : ' Income'} </h2>
        <form onSubmit={handleSubmit}>
          {/* ... other form fields (name, cost, etc.) remain the same ... */}
          {modalView === VIEW_MODE.EXPENSE_FORM && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                  <option value="" disabled>Select a category</option>
                  {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="__add_new__" className="font-bold text-blue-600">-- Add New Category --</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Amount (Expense)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full px-3 py-2 border rounded" required min="0" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input type="date" name="addedOn" value={formData.addedOn} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Notes (Optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded resize-y"
                  rows="3"
                  placeholder="E.g., Dinner at favorite restaurant, January salary"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <a className="text-blue-600 underline" href="#" onClick={handleSwitchToIncome}>
                    Add Income
                  </a>
                </label>
              </div>
            </>
          )}

          {modalView === VIEW_MODE.INCOME_FORM && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded" required>
                  <option value="" disabled>Select a category</option>
                  {incomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="__add_new__" className="font-bold text-blue-600">-- Add New Category --</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Amount (Income)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full px-3 py-2 border rounded" required min="0" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input type="date" name="addedOn" value={formData.addedOn} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Notes (Optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded resize-y"
                  rows="3"
                  placeholder="E.g., Dinner at favorite restaurant, January salary"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <a className="text-blue-600 underline" href="#" onClick={handleSwitchToExpense}>
                    Add Expense
                  </a>
                </label>
              </div>
            </>
          )}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;