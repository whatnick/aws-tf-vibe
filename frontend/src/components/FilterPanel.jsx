import { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Slider, 
  Typography,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function FilterPanel({ onFiltersChange, catalogs = [], collections = [] }) {
  const [filters, setFilters] = useState({
    catalog: '',
    collection: '',
    startDate: null,
    endDate: null,
    cloudCover: 100
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>STAC Catalog</InputLabel>
          <Select
            value={filters.catalog}
            onChange={(e) => handleFilterChange('catalog', e.target.value)}
          >
            {catalogs.map((cat) => (
              <MenuItem key={cat.id} value={cat.url}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Collection</InputLabel>
          <Select
            value={filters.collection}
            onChange={(e) => handleFilterChange('collection', e.target.value)}
          >
            {collections.map((col) => (
              <MenuItem key={col.id} value={col.id}>
                {col.title || col.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Start Date"
          value={filters.startDate}
          onChange={(date) => handleFilterChange('startDate', date)}
          sx={{ mb: 2, width: '100%' }}
        />

        <DatePicker
          label="End Date"
          value={filters.endDate}
          onChange={(date) => handleFilterChange('endDate', date)}
          sx={{ mb: 2, width: '100%' }}
        />

        <Typography gutterBottom>
          Max Cloud Cover: {filters.cloudCover}%
        </Typography>
        <Slider
          value={filters.cloudCover}
          onChange={(e, value) => handleFilterChange('cloudCover', value)}
          min={0}
          max={100}
          sx={{ mb: 2 }}
        />

        <Button 
          variant="outlined" 
          fullWidth
          onClick={() => {
            setFilters({
              catalog: '',
              collection: '',
              startDate: null,
              endDate: null,
              cloudCover: 100
            });
            onFiltersChange({
              catalog: '',
              collection: '',
              startDate: null,
              endDate: null,
              cloudCover: 100
            });
          }}
        >
          Clear Filters
        </Button>
      </Box>
    </LocalizationProvider>
  );
}