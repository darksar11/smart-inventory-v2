import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import * as inventoryService from '../services/inventoryService';

const InventoryOverview = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThresholdEditor, setShowThresholdEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [lowThreshold, setLowThreshold] = useState(5);
  const [criticalThreshold, setCriticalThreshold] = useState(2);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getProducts();
      const data = Array.isArray(response) ? response : response.data || [];
      setInventoryData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError('Failed to fetch inventory data. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.unitValue), 0);
  const uniqueProducts = inventoryData.length;
  const lowStockItems = inventoryData.filter(item =>
    item.quantity <= item.lowThreshold &&
    item.quantity > item.criticalThreshold
  ).length;
  const criticalStockItems = inventoryData.filter(item =>
    item.quantity <= item.criticalThreshold
  ).length;
  const healthyStockItems = inventoryData.filter(item =>
    item.quantity > item.lowThreshold
  ).length;

  const openThresholdEditor = (item) => {
    setEditingItem(item);
    setLowThreshold(item.lowThreshold);
    setCriticalThreshold(item.criticalThreshold);
    setShowThresholdEditor(true);
  };

  const saveThresholds = async () => {
    try {
      await inventoryService.updateProductThresholds(editingItem._id, {
        lowThreshold,
        criticalThreshold
      });

      const updatedInventory = inventoryData.map(item =>
        item._id === editingItem._id
          ? { ...item, lowThreshold, criticalThreshold }
          : item
      );
      setInventoryData(updatedInventory);
      setShowThresholdEditor(false);
    } catch (err) {
      console.error('Failed to update thresholds:', err);
      alert('Failed to update thresholds');
    }
  };

  const getStatusIndicator = (quantity, lowThreshold, criticalThreshold) => {
    if (quantity <= criticalThreshold) {
      return <AlertCircle className="text-red-500" size={20} />;
    } else if (quantity <= lowThreshold) {
      return <AlertTriangle className="text-yellow-500" size={20} />;
    } else {
      return <CheckCircle className="text-green-500" size={20} />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading inventory data...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Real-time Inventory Overview</h2>

      {error && (
        <div className="bg-red-100 p-4 rounded mb-4 text-red-700">
          {error}
          <button
            onClick={fetchInventoryData}
            className="ml-2 underline text-blue-600"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Total Items</h3>
          <p className="text-2xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Total Value</h3>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-800">Unique Products</h3>
          <p className="text-2xl font-bold">{uniqueProducts}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800">Stock Health</h3>
          <div className="flex items-center mt-2 space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>{healthyStockItems}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span>{lowStockItems}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span>{criticalStockItems}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {inventoryData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Value</th>
                <th className="py-2 px-4 text-left">Thresholds</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map(item => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4 flex items-center">
                    {getStatusIndicator(item.quantity, item.lowThreshold, item.criticalThreshold)}
                    <span className="ml-2">
                      {item.quantity <= item.criticalThreshold
                        ? 'Critical'
                        : item.quantity <= item.lowThreshold
                          ? 'Low'
                          : 'Healthy'}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    ${(item.quantity * item.unitValue).toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => openThresholdEditor(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Low: {item.lowThreshold}, Critical: {item.criticalThreshold}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 text-center rounded">
          <p className="text-gray-600">No inventory data available</p>
          <button
            onClick={fetchInventoryData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>
      )}

      {/* Threshold Editor Modal */}
      {showThresholdEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit Thresholds for {editingItem.name}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
              <input
                type="number"
                value={lowThreshold}
                onChange={(e) => setLowThreshold(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Critical Stock Threshold</label>
              <input
                type="number"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowThresholdEditor(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveThresholds}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryOverview;
