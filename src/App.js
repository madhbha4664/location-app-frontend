import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import './App.css'

function App() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty!");
      return;
    }

    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            await axios.post('http://localhost:5000/api/location', {
              name,
              latitude,
              longitude
            });
            setName('');
          } catch (err) {
            setError('Failed to save data');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setLoading(false);
          setError('Error: ' + err.message);
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        gap: 2,
        padding: 3
      }}
    >

      <TextField
        label="Enter name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!error && !name.trim()}
        helperText={error && !name.trim() ? "Name cannot be empty!" : ''}
        fullWidth
        sx={{width:'350px'}}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
        sx={{ height: '40px',width:'150px' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
      </Button>
    </Box>
  );
}

export default App;
