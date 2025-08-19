import { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import stacApi from '../services/stacApi';

export default function LocationSearch({ onLocationFound }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await stacApi.geocodeLocation(query);
      onLocationFound(result);
      setQuery('');
    } catch (err) {
      setError(err.response?.data?.error || 'Location not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          size="small"
          placeholder="Search location (e.g., Paris, France)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
    </Box>
  );
}