import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TransactionModal from '../components/TransactionModal';

const ReceiptsPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receiptResult, setReceiptResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [openEditReceiptResult, setOpenEditReceiptResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/transactions/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReceiptResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('receipt', file);
    
    try {
      setUploading(true);
      setError('');
      const response = await api.post('/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReceiptResult(response.data);
      
      // Open the modal to allow user to edit the extracted data
      setOpenEditReceiptResult(true);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditReceiptSubmit = async (formData, transactionId) => {
    try {
      // Update the receiptResult with the edited data
      const updatedReceiptResult = {
        ...receiptResult,
        extractedData: {
          merchant: formData.name,
          amount: parseFloat(formData.cost),
          category: formData.category,
          date: formData.addedOn,
          isIncome: formData.isIncome
        }
      };
      
      setReceiptResult(updatedReceiptResult);
      setOpenEditReceiptResult(false);
    } catch (err) {
      setError('Failed to update receipt data. Please try again.');
      console.error(err);
    }
  };

  // Handle final save to database (second verification step)
  const handleFinalSave = async () => {
    try {
      setIsSaving(true);
      
      const transactionData = {
        name: receiptResult.extractedData.merchant,
        category: receiptResult.extractedData.category,
        cost: receiptResult.extractedData.amount,
        addedOn: receiptResult.extractedData.date,
        isIncome: receiptResult.extractedData.isIncome || false
      };

      const response = await api.post('/receipts/save-transaction', {
        receiptId: receiptResult._id,
        transactionData: transactionData
      });

      alert('Transaction saved successfully! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save transaction. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit button in result div
  const handleEditResult = () => {
    setIsEditingResult(true);
    setOpenEditReceiptResult(true);
  };

  const handleNewCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory].sort());
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Upload Receipt</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select a receipt file (JPG, PNG, PDF)</label>
            <input 
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              accept=".jpeg,.jpg,.png,.pdf"
            />
            <button 
              type="submit" 
              disabled={uploading}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            >
              {uploading ? 'Processing...' : 'Upload & Extract Data'}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Last Upload Result</h2>
          {receiptResult ? (
            <div>
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300"><strong>Merchant:</strong> {receiptResult.extractedData.merchant}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Amount:</strong> {receiptResult.extractedData.amount.toFixed(2)}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Category:</strong> {receiptResult.extractedData.category}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Date:</strong> {new Date(receiptResult.extractedData.date).toLocaleDateString()}</p>
                {receiptResult.extractedData.isIncome && (
                  <p className="text-gray-700 dark:text-gray-300"><strong>Income:</strong> Yes</p>
                )}
              </div>

              <div className="flex gap-3 mb-4">
                <button 
                  onClick={handleEditResult}
                  disabled={isSaving}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white rounded-lg font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={handleFinalSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-medium"
                >
                  {isSaving ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>

              <img src={`http://localhost:5001${receiptResult.fileUrl}`} alt="Uploaded Receipt" className="mt-4 rounded-lg max-w-full h-auto" />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Upload a receipt to see the extracted data here.</p>
          )}
        </div>

      </div>

      {/* Transaction Modal for editing receipt data */}
      {openEditReceiptResult && receiptResult && (
        <TransactionModal 
          isOpen={openEditReceiptResult} 
          onClose={() => {
            setOpenEditReceiptResult(false);
            setIsEditingResult(false);
          }} 
          onSubmit={handleEditReceiptSubmit} 
          transaction={{
            name: receiptResult.extractedData.merchant || '',
            category: receiptResult.extractedData.category || '',
            cost: receiptResult.extractedData.amount || 0,
            addedOn: receiptResult.extractedData.date || new Date().toISOString().split('T')[0],
            isIncome: receiptResult.extractedData.isIncome || false
          }}
          categories={categories}
          onNewCategory={handleNewCategory}
        />
      )}
    </>
  );
};

export default ReceiptsPage;