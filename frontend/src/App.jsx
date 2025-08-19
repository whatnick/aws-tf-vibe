import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Paper, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MapComponent from './components/MapComponent';
import FilterPanel from './components/FilterPanel';
import LocationSearch from './components/LocationSearch';
import SatelliteSummary from './components/SatelliteSummary';
import stacApi from './services/stacApi';

const theme = createTheme();

export default function App() {
  const [catalogs, setCatalogs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({});
  const [bbox, setBbox] = useState(null);
  const [granuleCount, setGranuleCount] = useState(0);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [satelliteSummary, setSatelliteSummary] = useState(null);
  
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
    const fetchData = async () => {
      if (bbox && filters.catalog) {
        try {
          const [count, summary] = await Promise.all([
            stacApi.getItemCount(bbox, { ...filters, catalogUrl: filters.catalog }),
            stacApi.getSatelliteSummary(bbox, { ...filters, catalogUrl: filters.catalog })
          ]);
          setGranuleCount(count);
          setSatelliteSummary(summary);
        } catch (error) {
          console.error('Error fetching data:', error);
          setGranuleCount(0);
          setSatelliteSummary(null);
        }
      } else {
        setGranuleCount(0);
        setSatelliteSummary(null);
      }
    };

    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
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
              <SatelliteSummary summary={satelliteSummary} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}