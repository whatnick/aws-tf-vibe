import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationSearch from '../components/LocationSearch';
import * as stacApi from '../services/stacApi';

jest.mock('../services/stacApi');

const mockOnLocationFound = jest.fn();

test('renders search input and button', () => {
  render(<LocationSearch onLocationFound={mockOnLocationFound} />);
  
  expect(screen.getByLabelText(/search location/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
});

test('handles search input', async () => {
  const mockLocation = {
    name: 'Paris, France',
    geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }
  };
  
  stacApi.geocodeLocation = jest.fn().mockResolvedValue(mockLocation);
  
  render(<LocationSearch onLocationFound={mockOnLocationFound} />);
  
  const input = screen.getByLabelText(/search location/i);
  const button = screen.getByRole('button', { name: /search/i });
  
  fireEvent.change(input, { target: { value: 'Paris' } });
  fireEvent.click(button);
  
  await waitFor(() => {
    expect(mockOnLocationFound).toHaveBeenCalledWith(mockLocation);
  });
});