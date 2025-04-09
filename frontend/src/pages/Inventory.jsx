import React, { useState, useEffect } from "react";
import { getInventory, addProduct, deleteProduct, updateProduct } from "../api";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  Typography,
  Box,
  Modal
} from "@mui/material";

const Inventory = ({ onInventoryUpdate = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    lowThreshold: 5,
    criticalThreshold: 2,
    unitValue: "",
    sku: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getInventory();
      setProducts(response.data);
      onInventoryUpdate(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const {
        name,
        category,
        description,
        quantity,
        lowThreshold,
        criticalThreshold,
        unitValue,
        sku
      } = newProduct;

      if (!name || !category || !quantity || !unitValue) {
        alert("Please fill in required fields.");
        return;
      }

      const productToAdd = {
        name,
        category,
        description,
        quantity: Number(quantity),
        lowThreshold: Number(lowThreshold),
        criticalThreshold: Number(criticalThreshold),
        unitValue: Number(unitValue),
        sku
      };

      await addProduct(productToAdd);
      setNewProduct({
        name: "",
        category: "",
        description: "",
        quantity: "",
        lowThreshold: 5,
        criticalThreshold: 2,
        unitValue: "",
        sku: ""
      });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleEditProduct = async () => {
    try {
      const {
        name,
        category,
        description,
        quantity,
        lowThreshold,
        criticalThreshold,
        unitValue,
        sku,
        _id
      } = editProduct;

      if (!name || !category || !quantity || !unitValue) {
        alert("Please fill in required fields.");
        return;
      }

      const updatedProduct = {
        name,
        category,
        description,
        quantity: Number(quantity),
        lowThreshold: Number(lowThreshold),
        criticalThreshold: Number(criticalThreshold),
        unitValue: Number(unitValue),
        sku
      };

      await updateProduct(_id, updatedProduct);
      setEditProduct(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Smart Inventory Management
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <TextField
          label="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <TextField
          label="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <TextField
          type="number"
          label="Quantity"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <TextField
          type="number"
          label="Low Threshold"
          value={newProduct.lowThreshold}
          onChange={(e) => setNewProduct({ ...newProduct, lowThreshold: e.target.value })}
        />
        <TextField
          type="number"
          label="Critical Threshold"
          value={newProduct.criticalThreshold}
          onChange={(e) => setNewProduct({ ...newProduct, criticalThreshold: e.target.value })}
        />
        <TextField
          type="number"
          label="Unit Value"
          value={newProduct.unitValue}
          onChange={(e) => setNewProduct({ ...newProduct, unitValue: e.target.value })}
        />
        <TextField
          label="SKU"
          value={newProduct.sku}
          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddProduct}>Add</Button>
      </Box>

      <TextField
        fullWidth
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₹{product.unitValue}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => { setEditProduct(product); setIsModalOpen(true); }}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, borderRadius: 2 }}>
          <Typography variant="h6">Edit Product</Typography>
          {editProduct && (
            <>
              <TextField fullWidth label="Name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Category" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Description" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth type="number" label="Quantity" value={editProduct.quantity} onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth type="number" label="Low Threshold" value={editProduct.lowThreshold} onChange={(e) => setEditProduct({ ...editProduct, lowThreshold: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth type="number" label="Critical Threshold" value={editProduct.criticalThreshold} onChange={(e) => setEditProduct({ ...editProduct, criticalThreshold: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth type="number" label="Unit Value" value={editProduct.unitValue} onChange={(e) => setEditProduct({ ...editProduct, unitValue: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="SKU" value={editProduct.sku} onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })} sx={{ mb: 2 }} />
              <Button variant="contained" onClick={handleEditProduct} sx={{ mr: 2 }}>Save</Button>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Inventory;