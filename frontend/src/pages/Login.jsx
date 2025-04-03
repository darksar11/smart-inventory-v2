import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, transparent 20%, #000000 70%)',
          opacity: 0.1,
        },
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 4,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #121212 100%)',
            border: '1px solid rgba(255, 31, 31, 0.3)',
            boxShadow: '0 0 30px rgba(255, 31, 31, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #ff1f1f, transparent)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                color: '#ff1f1f',
                mb: 4,
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255, 31, 31, 0.5)',
                letterSpacing: '0.1em',
              }}
            >
              NEXUS ACCESS
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 31, 31, 0.3)',
                    transition: 'border-color 0.3s',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 31, 31, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff1f1f',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff1f1f',
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 31, 31, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 31, 31, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ff1f1f',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ff1f1f',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                position: 'relative',
                overflow: 'hidden',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 'bold',
                boxShadow: '0 0 15px rgba(255, 31, 31, 0.4)',
                '&:hover': {
                  boxShadow: '0 0 20px rgba(255, 31, 31, 0.6)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'all 0.5s',
                },
                '&:hover::after': {
                  left: '100%',
                },
              }}
            >
              Initialize Session
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
