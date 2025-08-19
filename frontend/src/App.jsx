import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, useMediaQuery } from '@mui/material';
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
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Container 
        maxWidth={false} 
        sx={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: isMobile ? 1 : 2
        }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          STAC Granule Lookup Tool
        </Typography>
        
        <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ height: isMobile ? 'auto' : '100%' }}>
              <FilterPanel 
                catalogs={catalogs}
                collections={collections}
                onFiltersChange={setFilters}
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={2} sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <LocationSearch onLocationFound={setSearchedLocation} />
              <MapComponent 
                onAreaSelect={setBbox} 
                searchedLocation={searchedLocation}
                height={isMobile ? '300px' : 'calc(100vh - 200px)'}
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