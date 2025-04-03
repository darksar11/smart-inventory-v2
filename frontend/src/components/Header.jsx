import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const isDashboard = location.pathname === "/dashboard";
    const isInventory = location.pathname === "/inventory";

    const handleLogout = () => {
        logout();
    };

    return (
        <AppBar 
            position="static" 
            sx={{ 
                background: 'linear-gradient(90deg, #000000 0%, #1a1a1a 100%)',
                borderBottom: '1px solid #ff1f1f',
                boxShadow: '0 0 15px rgba(255, 31, 31, 0.3)',
                mb: 3,
            }}
        >
            <Toolbar>
                {/* Logo/Title */}
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: "bold",
                        flexGrow: 1,
                        letterSpacing: '0.05em',
                        color: '#ff1f1f',
                        textShadow: '0 0 10px rgba(255, 31, 31, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box 
                        component="span" 
                        sx={{ 
                            mr: 1, 
                            fontSize: '1.3em', 
                            transform: 'translateY(-2px)' 
                        }}
                    >
                        ⚡
                    </Box>
                    NEXUS INVENTORY
                </Typography>

                {/* Navigation Buttons */}
                <Box sx={{ 
                    '& .MuiButton-root': { 
                        mx: 1, 
                        borderRadius: '4px',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                            transition: 'all 0.5s',
                        },
                        '&:hover::after': {
                            left: '100%',
                        }
                    } 
                }}>
                    <Button 
                        component={Link} 
                        to="/dashboard" 
                        variant={isDashboard ? "contained" : "outlined"}
                        color="primary"
                    >
                        Dashboard
                    </Button>
                    
                    <Button 
                        component={Link} 
                        to="/inventory" 
                        variant={isInventory ? "contained" : "outlined"}
                        color="primary"
                    >
                        Inventory
                    </Button>
                    
                    <Button 
                        onClick={handleLogout}
                        component={Link}
                        to="/login"
                        variant="outlined"
                        sx={{ 
                            ml: 2,
                            borderColor: 'rgba(255,31,31,0.5)', 
                            color: '#ff1f1f',
                            '&:hover': {
                                borderColor: '#ff1f1f',
                                backgroundColor: 'rgba(255,31,31,0.1)',
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
