import React from 'react';

const ManageCategoriesModal = ({ isOpen, onClose, expenseCategories, incomeCategories, onDelete }) => {
  // Pre-defined categories that should not be deleted
  const defaultExpenseCategories = [
    'Food', 'Shopping', 'Bills', 'Subscriptions', 'Transportation', 'Entertainment', 'Groceries', 'Miscellaneous'
  ];
  const defaultIncomeCategories = [
    'Salary',
    'Freelance / Side Gig',
    'Investment Returns',
    'Gifts',
    'Refunds'
  ];

  // Filter out the default categories to get the user-defined list
  const userExpenseDefinedCategories = expenseCategories.filter(cat => !defaultExpenseCategories.includes(cat));
  const userIncomeDefinedCategories = incomeCategories.filter(cat => !defaultIncomeCategories.includes(cat));

  const hasCustomCategories = userExpenseDefinedCategories.length > 0 || userIncomeDefinedCategories.length > 0;

  if (!isOpen) return null;

  const CategoryList = ({ title, categories }) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-700 border-b pb-1">{title}</h3>
      {categories.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {categories.map(category => (
            <li key={category} className="py-2 flex justify-between items-center">
              <span className="text-gray-800">{category}</span>
              <button
                onClick={() => onDelete(category)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm italic">No custom categories defined for this type.</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Manage Custom Categories</h2>

        {hasCustomCategories ? (
          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">

            <CategoryList
              title="Expense Categories"
              categories={userExpenseDefinedCategories}
            />
            <CategoryList
              title="Income Categories"
              categories={userIncomeDefinedCategories}
            />

          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">You haven't added any custom categories yet.</p>
        )}

        <div className="flex justify-end mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategoriesModal;