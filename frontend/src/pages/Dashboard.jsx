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
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme
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
  const theme = useTheme();

  useEffect(() => {
    document.title = "Nexus Inventory | Dashboard";
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const response = await getInventory();
      console.log("Fetched inventory:", response.data);
      
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

  // Calculate summary statistics
  const totalItems = inventoryData.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  
  // Fix total value calculation to use unitValue instead of price
  const totalValue = inventoryData.reduce(
    (sum, item) => {
      const quantity = item?.quantity || 0;
      const unitValue = item?.unitValue || 0; // Changed from price to unitValue
      return sum + (quantity * unitValue);
    },
    0
  ).toFixed(2);
  
  const uniqueProducts = inventoryData.length;
  
  // Update low stock calculation to use user-defined thresholds
  const lowStockItems = inventoryData.filter(item => {
    const quantity = item?.quantity || 0;
    const lowThreshold = item?.lowThreshold || 5;
    const criticalThreshold = item?.criticalThreshold || 2;
    
    return quantity <= lowThreshold && quantity > criticalThreshold;
  }).length;

  // Function to determine color based on stock status
  const getItemColor = (item) => {
    const quantity = item?.quantity || 0;
    const lowThreshold = item?.lowThreshold || 5;
    const criticalThreshold = item?.criticalThreshold || 2;
    
    if (quantity <= criticalThreshold) {
      return "rgba(244, 67, 54, 0.8)"; // Red for critical stock
    } else if (quantity <= lowThreshold) {
      return "rgba(255, 152, 0, 0.8)"; // Orange/Yellow for low stock
    } else {
      return "rgba(53, 162, 235, 0.8)"; // Blue for healthy stock
    }
  };

  // Function to determine border color based on stock status
  const getItemBorderColor = (item) => {
    const quantity = item?.quantity || 0;
    const lowThreshold = item?.lowThreshold || 5;
    const criticalThreshold = item?.criticalThreshold || 2;
    
    if (quantity <= criticalThreshold) {
      return "rgba(244, 67, 54, 1)"; // Red border for critical stock
    } else if (quantity <= lowThreshold) {
      return "rgba(255, 152, 0, 1)"; // Orange/Yellow border for low stock
    } else {
      return "rgba(53, 162, 235, 1)"; // Blue border for healthy stock
    }
  };

  // Modified chart data with dynamic colors based on stock levels
  const chartData = {
    labels: inventoryData.map(item => item?.productName || item?.name || "Unnamed"),
    datasets: [
      {
        label: "Stock Quantity",
        data: inventoryData.map(item => item?.quantity || 0),
        backgroundColor: inventoryData.map(item => getItemColor(item)),
        borderColor: inventoryData.map(item => getItemBorderColor(item)),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 30
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold"
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 6,
        callbacks: {
          // Adding threshold information to tooltips
          afterLabel: function(context) {
            const item = inventoryData[context.dataIndex];
            if (!item) return '';
            
            const quantity = item.quantity || 0;
            const lowThreshold = item.lowThreshold || 5;
            const criticalThreshold = item.criticalThreshold || 2;
            
            let status = "Healthy";
            if (quantity <= criticalThreshold) {
              status = "Critical Stock";
            } else if (quantity <= lowThreshold) {
              status = "Low Stock";
            }
            
            return [
              `Status: ${status}`,
              `Low Threshold: ${lowThreshold}`,
              `Critical Threshold: ${criticalThreshold}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  // Custom styles to match the screenshot
  const cardHeaderStyle = {
    height: 8, 
    borderTopLeftRadius: 8, 
    borderTopRightRadius: 8
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: "#f8f9fc", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#111827" }}>
            Inventory Dashboard
          </Typography>
          <Button
            variant="contained"
            onClick={fetchInventory}
            sx={{ 
              backgroundColor: "#1976d2",
              borderRadius: 1,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#1565c0"
              }
            }}
          >
            REFRESH DATA
          </Button>
        </Box>
      </motion.div>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            my: 2, 
            borderRadius: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card sx={{ 
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%",
                  position: "relative"
                }}>
                  <Box sx={{ ...cardHeaderStyle, backgroundColor: "#1976d2" }} />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" color="textSecondary" fontSize={14}>
                        Total Items
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: "rgba(25, 118, 210, 0.1)", 
                        borderRadius: "50%",
                        p: 1,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#1976d2"
                      }}>
                        I
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                      {totalItems.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total inventory units
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <Card sx={{ 
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%"
                }}>
                  <Box sx={{ ...cardHeaderStyle, backgroundColor: "#4caf50" }} />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" color="textSecondary" fontSize={14}>
                        Total Value
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: "rgba(76, 175, 80, 0.1)", 
                        borderRadius: "50%",
                        p: 1,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#4caf50"
                      }}>
                        $
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                      ${Number(totalValue).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total inventory value
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                <Card sx={{ 
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%"
                }}>
                  <Box sx={{ ...cardHeaderStyle, backgroundColor: "#2196f3" }} />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" color="textSecondary" fontSize={14}>
                        Unique Products
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: "rgba(33, 150, 243, 0.1)", 
                        borderRadius: "50%",
                        p: 1,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#2196f3"
                      }}>
                        P
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                      {uniqueProducts}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Distinct product types
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                <Card sx={{ 
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
                  borderRadius: 2,
                  overflow: "hidden",
                  height: "100%"
                }}>
                  <Box sx={{ ...cardHeaderStyle, backgroundColor: "#ff9800" }} />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" color="textSecondary" fontSize={14}>
                        Low Stock
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: "rgba(255, 152, 0, 0.1)", 
                        borderRadius: "50%",
                        p: 1,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#ff9800"
                      }}>
                        !
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                      {lowStockItems}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Items requiring restock
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Inventory Overview */}
            <Grid item xs={12} lg={8}>
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                <Card sx={{ 
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
                  borderRadius: 2,
                  overflow: "hidden"
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
                      Inventory Stock Overview
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      {inventoryData.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                      ) : (
                        <Box sx={{ 
                          display: "flex", 
                          justifyContent: "center", 
                          alignItems: "center", 
                          height: "100%",
                          flexDirection: "column",
                          gap: 2,
                          backgroundColor: "rgba(0,0,0,0.02)",
                          borderRadius: 2,
                          p: 3
                        }}>
                          <Typography variant="h6" color="textSecondary" fontSize={14}>
                            No Data Available
                          </Typography>
                          <Typography variant="body1" color="textSecondary" align="center">
                            No inventory data available.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Inventory Detail */}
            <Grid item xs={12} lg={4}>
              <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                <Card sx={{ 
                  boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
                  borderRadius: 2,
                  overflow: "hidden"
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
                      Inventory Details
                    </Typography>
                    <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                      <InventoryOverview />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <motion.div 
            {...fadeInUp} 
            transition={{ delay: 0.4 }}
            style={{ marginTop: "24px" }}
          >
            <Card sx={{ 
              boxShadow: "0 4px 6px rgba(0,0,0,0.07)", 
              borderRadius: 2,
              overflow: "hidden"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "600", mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        borderRadius: 1,
                        backgroundColor: "#1976d2",
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          backgroundColor: "#1565c0"
                        }
                      }}
                    >
                      Add New Product
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        borderRadius: 1,
                        backgroundColor: "#4caf50",
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          backgroundColor: "#43a047"
                        }
                      }}
                    >
                      Generate Report
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        borderRadius: 1,
                        backgroundColor: "#e91e63",
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          backgroundColor: "#d81b60"
                        }
                      }}
                    >
                      Review Orders
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </Box>
  );
};

export default Dashboard;