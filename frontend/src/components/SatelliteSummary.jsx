import { Paper, Typography, Grid, Chip, Box } from '@mui/material';
import { Satellite, Terrain, Public } from '@mui/icons-material';

export default function SatelliteSummary({ summary }) {
  if (!summary || summary.total === 0) {
    return null;
  }

  const getSatelliteIcon = (type) => {
    switch (type) {
      case 'sentinel-2': return <Satellite sx={{ mr: 1 }} />;
      case 'landsat': return <Terrain sx={{ mr: 1 }} />;
      default: return <Public sx={{ mr: 1 }} />;
    }
  };

  const getSatelliteName = (type) => {
    switch (type) {
      case 'sentinel-2': return 'Sentinel-2';
      case 'landsat': return 'Landsat';
      default: return 'Other';
    }
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'sentinel-2': return 'primary';
      case 'landsat': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Satellite Data Summary
      </Typography>
      
      <Grid container spacing={2}>
        {Object.entries(summary)
          .filter(([key]) => key !== 'total' && summary[key] > 0)
          .map(([satellite, count]) => (
            <Grid item xs={12} sm={4} key={satellite}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  {getSatelliteIcon(satellite)}
                  <Typography variant="body2">
                    {getSatelliteName(satellite)}
                  </Typography>
                </Box>
                <Chip 
                  label={count.toLocaleString()} 
                  color={getChipColor(satellite)}
                  size="small"
                />
              </Box>
            </Grid>
          ))
        }
        
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Total Granules
            </Typography>
            <Chip 
              label={summary.total.toLocaleString()} 
              color="success"
              variant="outlined"
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}