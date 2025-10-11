const Receipt = require('../models/Receipt');
const IncomeExpense = require('../models/IncomeExpense');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert a file to a format Gemini can understand
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType
    },
  };
}

// @desc    Upload a receipt and extract data using Gemini
// @route   POST /api/receipts/upload
// @access  Private
const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
      Analyze this receipt image. Extract the following details:
      - merchant: The name of the store or merchant.
      - amount: The final total amount paid, as a number.
      - date: The date of the transaction in YYYY-MM-DD format.
      - category: Suggest a likely category from this list: Groceries, Food, Shopping, Bills, Transportation, Entertainment.

      Return the result as a single, minified JSON object. For example:
      {"merchant":"Walmart","amount":42.97,"date":"2025-09-13","category":"Groceries"}
    `;
    
    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(text);

    const newReceipt = new Receipt({
      user: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedData: {
        amount: extractedData.amount || 0,
        category: extractedData.category || 'Miscellaneous',
        date: extractedData.date ? new Date(extractedData.date) : new Date(),
        merchant: extractedData.merchant || 'Unknown Merchant',
      },
    });

    const savedReceipt = await newReceipt.save();

    res.status(201).json(savedReceipt);

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ message: 'Failed to process receipt with AI', error: error.message });
  } finally {
    // Deleting the temporary file from the server
    fs.unlinkSync(req.file.path);
  }
};

// @desc    Save transaction after user confirmation and edits
// @route   POST /api/receipts/save-transaction
// @access  Private
const saveTransactionFromReceipt = async (req, res) => {
  try {
    const { receiptId, transactionData } = req.body;

    // Validate required fields
    if (!receiptId || !transactionData) {
      return res.status(400).json({ message: 'Receipt ID and transaction data are required' });
    }

    // Verify the receipt belongs to the user
    const receipt = await Receipt.findOne({ _id: receiptId, user: req.user.id });
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Create the transaction with user-confirmed data
    const newTransaction = new IncomeExpense({
      user: req.user.id,
      name: transactionData.name,
      category: transactionData.category,
      cost: transactionData.cost,
      addedOn: new Date(transactionData.addedOn),
      isIncome: transactionData.isIncome || false,
    });

    const savedTransaction = await newTransaction.save();

    // Update the receipt with the final confirmed data
    receipt.extractedData = {
      merchant: transactionData.name,
      amount: transactionData.cost,
      category: transactionData.category,
      date: new Date(transactionData.addedOn),
      isIncome: transactionData.isIncome || false,
    };
    await receipt.save();

    res.status(201).json({
      message: 'Transaction saved successfully',
      transaction: savedTransaction,
      receipt: receipt
    });

  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ message: 'Failed to save transaction', error: error.message });
  }
};

module.exports = {
  uploadReceipt,
  saveTransactionFromReceipt,
};