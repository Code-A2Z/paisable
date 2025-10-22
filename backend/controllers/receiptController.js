const Receipt = require("../models/Receipt");
const IncomeExpense = require("../models/IncomeExpense");
const { GoogleGenAI } = require("@google/genai");

const fs = require("fs");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to convert a file to a format Gemini can understand
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
}

// @desc    Upload a receipt and extract data using Gemini
// @route   POST /api/receipts/upload
// @access  Private
const uploadReceipt = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  try {
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

    const result = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
    });

    const raw =
      result.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n\n") ??
      "";

    const cleanedText = raw
      .replace(/^[\s`]*```json[\s`]*/i, "") // Remove opening ```json with spaces
      .replace(/[\s`]*```$/i, "") // Remove closing ```
      .trim();

    let extractedData;
    try {
      extractedData = JSON.parse(cleanedText);
    } catch (e) {
      console.warn("[Gemini] Invalid JSON, fallback to defaults.", e);
      extractedData = {};
    }

    const newReceipt = new Receipt({
      user: req.user.id,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedData: {
        amount: extractedData.amount || 0,
        category: extractedData.category || "Miscellaneous",
        date: extractedData.date ? new Date(extractedData.date) : new Date(),
        merchant: extractedData.merchant || "Unknown Merchant",
      },
    });

    const savedReceipt = await newReceipt.save();

    // Automatically create a corresponding expense transaction
    if (savedReceipt) {
      const newTransaction = new IncomeExpense({
        user: req.user.id,
        name: savedReceipt.extractedData.merchant,
        category: savedReceipt.extractedData.category,
        cost: savedReceipt.extractedData.amount,
        addedOn: savedReceipt.extractedData.date,
        isIncome: false,
      });
      await newTransaction.save();
    }

    res.status(201).json(savedReceipt);
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res
      .status(500)
      .json({
        message: "Failed to process receipt with AI",
        error: error.message,
      });
  } finally {
    // Deleting the temporary file from the server
    fs.unlinkSync(req.file.path);
  }
};

module.exports = {
  uploadReceipt,
};
