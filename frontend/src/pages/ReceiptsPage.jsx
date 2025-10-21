import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast, Bounce } from "react-toastify";
const ReceiptsPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receiptResult, setReceiptResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      return setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setReceiptResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setUploading(true);
      setError("");
      const response = await api.post("/receipts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setReceiptResult(response.data);

      toast.success("Receipt processed successfully and transaction created!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontSize: "18px", // increases text size
          padding: "16px 24px", // increases toast size
          minWidth: "500px", // optional: increase width
        },
        theme: "light",
        transition: Bounce,
      });
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Upload Receipt
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select a receipt file (JPG, PNG, PDF)
            </label>
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
              {uploading ? "Processing..." : "Upload & Create Transaction"}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Last Upload Result
          </h2>
          {receiptResult ? (
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Merchant:</strong>{" "}
                {receiptResult.extractedData.merchant}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Amount:</strong>{" "}
                {receiptResult.extractedData.amount.toFixed(2)}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Category:</strong>{" "}
                {receiptResult.extractedData.category}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Date:</strong>{" "}
                {new Date(
                  receiptResult.extractedData.date
                ).toLocaleDateString()}
              </p>
              <img
                src={`http://localhost:5000${receiptResult.fileUrl}`}
                alt="Uploaded Receipt"
                className="mt-4 rounded-lg max-w-full h-auto"
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Upload a receipt to see the extracted data here.
            </p>
          )}
        </div>
        {isMobile && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </>
  );
};

export default ReceiptsPage;
