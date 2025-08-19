import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationSearch from '../components/LocationSearch';
import stacApi from '../services/stacApi';

jest.mock('../services/stacApi');

describe('LocationSearch', () => {
  const mockOnLocationFound = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input', () => {
    render(<LocationSearch onLocationFound={mockOnLocationFound} />);
    expect(screen.getByLabelText(/search location/i)).toBeInTheDocument();
  });

  test('handles search input and calls API', async () => {
    const mockLocation = {
      name: 'Paris, France',
      geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }
    };
    
    stacApi.geocodeLocation.mockResolvedValue(mockLocation);

    render(<LocationSearch onLocationFound={mockOnLocationFound} />);
    
    const input = screen.getByLabelText(/search location/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(stacApi.geocodeLocation).toHaveBeenCalledWith('Paris');
      expect(mockOnLocationFound).toHaveBeenCalledWith(mockLocation);
    });
  });

  test('handles API error gracefully', async () => {
    stacApi.geocodeLocation.mockRejectedValue(new Error('Location not found'));

    render(<LocationSearch onLocationFound={mockOnLocationFound} />);
    
    const input = screen.getByLabelText(/search location/i);
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'InvalidLocation' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(stacApi.geocodeLocation).toHaveBeenCalledWith('InvalidLocation');
      expect(mockOnLocationFound).not.toHaveBeenCalled();
    });
  });
});