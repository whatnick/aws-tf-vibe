import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MapComponent from './components/MapComponent';
import FilterPanel from './components/FilterPanel';
import LocationSearch from './components/LocationSearch';
import stacApi from './services/stacApi';

const theme = createTheme();

export default function App() {
  const [catalogs, setCatalogs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({});
  const [bbox, setBbox] = useState(null);
  const [granuleCount, setGranuleCount] = useState(0);
  const [searchedLocation, setSearchedLocation] = useState(null);

  useEffect(() => {
    stacApi.getCatalogs().then(setCatalogs);
  }, []);

  useEffect(() => {
    if (filters.catalog) {
      stacApi.getCollections(filters.catalog).then(setCollections);
    }
  }, [filters.catalog]);

  useEffect(() => {
    if (bbox && filters.catalog) {
      stacApi.getItemCount(bbox, { ...filters, catalogUrl: filters.catalog })
        .then(setGranuleCount);
    }
  }, [bbox, filters]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom>
          STAC Granule Lookup Tool
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2}>
              <FilterPanel 
                catalogs={catalogs}
                collections={collections}
                onFiltersChange={setFilters}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <LocationSearch onLocationFound={setSearchedLocation} />
              <MapComponent 
                onAreaSelect={setBbox} 
                searchedLocation={searchedLocation}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Results: {granuleCount} granules found
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}