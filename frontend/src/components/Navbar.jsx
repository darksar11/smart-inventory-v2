import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    return (
        <AppBar position="static" sx={{ backgroundColor: "#1976D2", mb: 2 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                    Smart Inventory
                </Typography>

                <Box>
                    {location.pathname !== "/dashboard" && (
                        <Button component={Link} to="/dashboard" variant="contained" sx={{ mr: 1, bgcolor: "purple" }}>
                            Dashboard
                        </Button>
                    )}
                    <Button component={Link} to="/inventory" variant="contained" sx={{ mr: 1, bgcolor: "purple" }}>
                        Inventory
                    </Button>
                    {location.pathname === "/dashboard" ? (
                        <Button component={Link} to="/login" variant="contained" sx={{ bgcolor: "green" }}>
                            Login
                        </Button>
                    ) : null}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
