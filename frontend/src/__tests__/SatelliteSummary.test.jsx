import { render, screen } from '@testing-library/react';
import SatelliteSummary from '../components/SatelliteSummary';

test('renders satellite summary with data', () => {
  const mockSummary = {
    'sentinel-2': 150,
    'landsat': 75,
    'other': 25,
    'total': 250
  };

  render(<SatelliteSummary summary={mockSummary} />);
  
  expect(screen.getByText('Satellite Data Summary')).toBeInTheDocument();
  expect(screen.getByText('Sentinel-2')).toBeInTheDocument();
  expect(screen.getByText('Landsat')).toBeInTheDocument();
  expect(screen.getByText('250')).toBeInTheDocument();
});

test('does not render when summary is empty', () => {
  const mockSummary = { total: 0 };
  
  const { container } = render(<SatelliteSummary summary={mockSummary} />);
  expect(container.firstChild).toBeNull();
});