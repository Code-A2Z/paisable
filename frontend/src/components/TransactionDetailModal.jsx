import React from 'react';
import useCurrency from '../hooks/useCurrency'; 

const DetailRow = ({ label, value, color }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className={`text-sm font-semibold text-gray-900 ${color || ''}`}>{value}</span>
    </div>
);


const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    const { currency } = useCurrency(); 

    if (!isOpen || !transaction) return null;

    const isIncome = transaction.isIncome;
    const amount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
    }).format(transaction.cost);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4"
                onClick={e => e.stopPropagation()} 
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
                    Transaction Details
                </h2>

                <div className="space-y-1">
                    
                    <DetailRow 
                        label="Type" 
                        value={isIncome ? 'Income' : 'Expense'} 
                        color={isIncome ? 'text-green-600' : 'text-red-600'}
                    />
                    
                    <DetailRow label="Name/Description" value={transaction.name} />

                    <DetailRow label="Category" value={transaction.category} />

                    <DetailRow 
                        label="Amount" 
                        value={`${isIncome ? '+' : '-'}${amount}`} 
                        color={isIncome ? 'text-green-600' : 'text-red-600'}
                    />
                    
                    <DetailRow 
                        label="Date" 
                        value={new Date(transaction.addedOn).toLocaleDateString()} 
                    />

                    <div className="pt-4 mt-2">
                        <p className="text-sm font-bold text-gray-700 mb-1">Note:</p>
                        <p className="text-base text-gray-800 bg-gray-50 p-3 rounded-lg border">
                            {transaction.note || "No note provided."}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={onClose} 
                    className="mt-8 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TransactionDetailModal;