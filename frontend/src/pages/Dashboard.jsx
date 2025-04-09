import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button
} from "@mui/material";
import { motion } from "framer-motion";
import InventoryOverview from "./InventoryOverview";
import { getInventory } from "../api";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Inventory Dashboard";
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const response = await getInventory();

      // Debugging output to ensure correct data structure
      console.log("Fetched inventory:", response.data);

      // Adjust this line if your data is nested inside an object
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.inventory || [];

      setInventoryData(data);
      setError(null);
    } catch (err) {
      setError("Failed to load inventory data. Please check your connection.");
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: inventoryData.map(item => item?.productName || "Unnamed"),
    datasets: [
      {
        label: "Stock Quantity",
        data: inventoryData.map(item => item?.quantity || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography variant="h4" gutterBottom>
          Inventory Dashboard
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Button variant="contained" color="primary" onClick={fetchInventory} sx={{ mb: 2 }}>
        Refresh Inventory
      </Button>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InventoryOverview />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper sx={{ mt: 4, p: 2, height: 400 }}>
              <Typography variant="h5" gutterBottom>
                Inventory Stock Overview
              </Typography>
              <Box sx={{ height: "100%", minHeight: 300 }}>
                {inventoryData.length > 0 ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <Typography variant="body1" color="textSecondary" align="center">
                    No inventory data available.
                  </Typography>
                )}
              </Box>
            </Paper>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow p-4 mt-6">
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button variant="contained" color="primary">
                  Add New Product
                </Button>
                <Button variant="contained" color="success">
                  Generate Report
                </Button>
                <Button variant="contained" color="secondary">
                  Review Orders
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
