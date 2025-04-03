import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { motion } from "framer-motion"; // Import Framer Motion
import Inventory from "./Inventory";
import { getInventory } from "../api"; // API call to fetch inventory

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch inventory data
    const fetchInventory = async () => {
        try {
            setIsLoading(true);
            const response = await getInventory();
            setInventoryData(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to load inventory data. Please try again.");
            console.error("Error fetching inventory:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleInventoryUpdate = () => {
        fetchInventory(); // Refresh inventory data when items are added/updated
    };

    // Chart Data
    const chartData = {
        labels: inventoryData.map(item => item.productName),
        datasets: [
            {
                label: "Stock Quantity",
                data: inventoryData.map(item => item.quantity),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }
        ]
    };

    // Chart Options
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
            {/* Animated Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>
            </motion.div>

            {/* Animated Inventory Management Component */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Inventory onInventoryUpdate={handleInventoryUpdate} />
            </motion.div>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
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
            )}
        </Box>
    );
};

export default Dashboard;
