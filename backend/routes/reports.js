// backend/routes/reports.js

import express from 'express';
import ExcelJS from 'exceljs';

// Import your models
import Inventory from '../models/Inventory.js';

const router = express.Router();

// Generate and download Excel report
router.get('/generate-excel', async (req, res) => {
  try {
    // Get inventory data - without the populate that's causing the error
    const inventoryData = await Inventory.find();
    
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Nexus Inventory System';
    workbook.created = new Date();
    
    // Add Summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    
    // Add title and date
    summarySheet.addRow(['NEXUS INVENTORY REPORT']);
    summarySheet.getCell('A1').font = { size: 16, bold: true };
    summarySheet.addRow(['Generated on:', new Date().toLocaleString()]);
    summarySheet.addRow([]);
    
    // Calculate summary statistics - modified to work with direct fields instead of populated fields
    const totalItems = inventoryData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalValue = inventoryData.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const unitValue = item.unitValue || 0;
      return sum + (quantity * unitValue);
    }, 0);
    const uniqueProducts = inventoryData.length; // Count unique documents
    
    // Count low stock items (using your dashboard threshold logic)
    const lowStockItems = inventoryData.filter(item => {
      const quantity = item.quantity || 0;
      const lowThreshold = item.lowThreshold || 5;
      const criticalThreshold = item.criticalThreshold || 2;
      return quantity <= lowThreshold && quantity > criticalThreshold;
    });
    
    // Count critical stock items
    const criticalStockItems = inventoryData.filter(item => {
      const quantity = item.quantity || 0;
      const criticalThreshold = item.criticalThreshold || 2;
      return quantity <= criticalThreshold;
    });
    
    // Add summary data
    summarySheet.addRow(['Summary Statistics']);
    summarySheet.getCell('A4').font = { bold: true };
    summarySheet.addRow(['Total Items:', totalItems]);
    summarySheet.addRow(['Total Value:', `$${totalValue.toFixed(2)}`]);
    summarySheet.addRow(['Unique Products:', uniqueProducts]);
    summarySheet.addRow(['Low Stock Items:', lowStockItems.length]);
    summarySheet.addRow(['Critical Stock Items:', criticalStockItems.length]);
    summarySheet.addRow([]);
    
    // Get stock by category - modified to work with direct fields
    const categoryTotals = {};
    inventoryData.forEach(item => {
      const category = item.category || 'Uncategorized';
      const quantity = item.quantity || 0;
      const unitValue = item.unitValue || 0;
      const value = quantity * unitValue;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += value;
    });
    
    // Add category breakdown
    summarySheet.addRow(['Stock Value by Category']);
    summarySheet.getCell('A10').font = { bold: true };
    summarySheet.addRow(['Category', 'Value']);
    summarySheet.getCell('A11').font = { bold: true };
    summarySheet.getCell('B11').font = { bold: true };
    
    let rowIndex = 12;
    Object.entries(categoryTotals).forEach(([category, value]) => {
      summarySheet.addRow([category, `$${value.toFixed(2)}`]);
      rowIndex++;
    });
    
    // Formatting
    summarySheet.getColumn(1).width = 20;
    summarySheet.getColumn(2).width = 20;
    
    // Add Stock Status worksheet
    const stockStatusSheet = workbook.addWorksheet('Stock Status');
    
    // Add headers
    stockStatusSheet.columns = [
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Current Quantity', key: 'quantity', width: 18 },
      { header: 'Low Threshold', key: 'lowThreshold', width: 18 },
      { header: 'Critical Threshold', key: 'criticalThreshold', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    
    // Style the header row
    stockStatusSheet.getRow(1).font = { bold: true };
    stockStatusSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add data - modified to work with direct fields
    inventoryData.forEach(item => {
      const quantity = item.quantity || 0;
      const lowThreshold = item.lowThreshold || 5;
      const criticalThreshold = item.criticalThreshold || 2;
      
      let status = 'Healthy';
      if (quantity <= criticalThreshold) {
        status = 'Critical';
      } else if (quantity <= lowThreshold) {
        status = 'Low';
      }
      
      stockStatusSheet.addRow({
        name: item.name || item.productName,
        sku: item.sku || '-',
        category: item.category || 'Uncategorized',
        quantity: quantity,
        lowThreshold: lowThreshold,
        criticalThreshold: criticalThreshold,
        status: status
      });
    });
    
    // Color-code the status column
    for (let i = 2; i <= stockStatusSheet.rowCount; i++) {
      const cell = stockStatusSheet.getCell(`G${i}`);
      if (cell.value === 'Critical') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF9999' } // Light red
        };
      } else if (cell.value === 'Low') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCC99' } // Light orange
        };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF99CC99' } // Light green
        };
      }
    }
    
    // Add Inventory Details worksheet
    const detailsSheet = workbook.addWorksheet('Inventory Details');
    
    // Add headers
    detailsSheet.columns = [
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Unit Value', key: 'unitValue', width: 15 },
      { header: 'Total Value', key: 'totalValue', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Last Updated', key: 'lastUpdated', width: 20 }
    ];
    
    // Style the header row
    detailsSheet.getRow(1).font = { bold: true };
    detailsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add data - modified to work with direct fields
    inventoryData.forEach(item => {
      const quantity = item.quantity || 0;
      const unitValue = item.unitValue || 0;
      const totalValue = quantity * unitValue;
      
      detailsSheet.addRow({
        name: item.name || item.productName,
        sku: item.sku || '-',
        category: item.category || 'Uncategorized',
        quantity: quantity,
        unitValue: `$${unitValue.toFixed(2)}`,
        totalValue: `$${totalValue.toFixed(2)}`,
        location: item.location || '-',
        lastUpdated: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'
      });
    });
    
    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Set headers to download the file
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="NexusInventoryReport-${new Date().toISOString().split('T')[0]}.xlsx"`,
      'Content-Length': buffer.length
    });
    
    // Send the Excel file
    res.send(buffer);
  } catch (err) {
    console.error('Error generating Excel report:', err);
    res.status(500).json({ message: 'Failed to generate Excel report', error: err.message });
  }
});

export default router;