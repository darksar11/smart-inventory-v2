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

const Inventory = ({ onInventoryUpdate }) => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ productName: "", quantity: "", price: "" });
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
            onInventoryUpdate(response.data); // Update graph in Dashboard
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get inventory summary
router.get('/summary', async (req, res) => {
  try {
    const products = await Product.find();
    
    const summary = {
      totalItems: products.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: products.reduce((sum, item) => sum + (item.quantity * item.unitValue), 0),
      uniqueProducts: products.length,
      lowStockItems: products.filter(item => 
        item.quantity <= item.lowThreshold && 
        item.quantity > item.criticalThreshold
      ).length,
      criticalStockItems: products.filter(item => 
        item.quantity <= item.criticalThreshold
      ).length,
      healthyStockItems: products.filter(item => 
        item.quantity > item.lowThreshold
      ).length
    };
    
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/products/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Create a product
router.post('/products', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    quantity: req.body.quantity,
    lowThreshold: req.body.lowThreshold,
    criticalThreshold: req.body.criticalThreshold,
    unitValue: req.body.unitValue,
    sku: req.body.sku
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.patch('/products/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.category != null) {
    res.product.category = req.body.category;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.quantity != null) {
    res.product.quantity = req.body.quantity;
  }
  if (req.body.lowThreshold != null) {
    res.product.lowThreshold = req.body.lowThreshold;
  }
  if (req.body.criticalThreshold != null) {
    res.product.criticalThreshold = req.body.criticalThreshold;
  }
  if (req.body.unitValue != null) {
    res.product.unitValue = req.body.unitValue;
  }
  if (req.body.sku != null) {
    res.product.sku = req.body.sku;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product thresholds only
router.patch('/products/:id/thresholds', getProduct, async (req, res) => {
  if (req.body.lowThreshold != null) {
    res.product.lowThreshold = req.body.lowThreshold;
  }
  if (req.body.criticalThreshold != null) {
    res.product.criticalThreshold = req.body.criticalThreshold;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/products/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;

    const handleAddProduct = async () => {
        try {
            if (!newProduct.productName || !newProduct.quantity || !newProduct.price) {
                alert("Please fill in all fields.");
                return;
            }
            await addProduct(newProduct);
            setNewProduct({ productName: "", quantity: "", price: "" });
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
            if (!editProduct.productName || !editProduct.quantity || !editProduct.price) {
                alert("Please fill in all fields.");
                return;
            }
            await updateProduct(editProduct._id, editProduct);
            setEditProduct(null);
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    const lowStockThreshold = 10;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Inventory Management
            </Typography>

            {/* Product Input Fields */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    label="Product Name"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                />
                <TextField
                    type="number"
                    label="Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
                <TextField
                    type="number"
                    label="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAddProduct}
                >
                    Add Product
                </Button>
            </Box>

            {/* Search Bar */}
            <TextField
                fullWidth
                label="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
            />

            {/* Inventory Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products
                            .filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((product) => (
                                <TableRow 
                                    key={product._id}
                                    sx={{ 
                                        backgroundColor: product.quantity < lowStockThreshold 
                                            ? 'rgba(255, 0, 0, 0.1)' 
                                            : 'inherit' 
                                    }}
                                >
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell 
                                        align="right" 
                                        sx={{ 
                                            color: product.quantity < lowStockThreshold 
                                                ? 'red' 
                                                : 'inherit' 
                                        }}
                                    >
                                        {product.quantity}
                                    </TableCell>
                                    <TableCell align="right">₹{product.price}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => {
                                                setEditProduct(product);
                                                setIsModalOpen(true);
                                            }}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Product Modal */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box 
                    sx={{
                        position: "absolute", 
                        top: "50%", 
                        left: "50%", 
                        transform: "translate(-50%, -50%)", 
                        width: 400, 
                        bgcolor: "background.paper", 
                        p: 4, 
                        boxShadow: 24, 
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6" gutterBottom>Edit Product</Typography>
                    {editProduct && (
                        <>
                            <TextField
                                fullWidth
                                label="Product Name"
                                value={editProduct.productName}
                                onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity"
                                value={editProduct.quantity}
                                onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Price"
                                value={editProduct.price}
                                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleEditProduct}
                                sx={{ mr: 2 }}
                            >
                                Save
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Inventory;
