import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '../components/FilterPanel';

const mockCatalogs = [
  { name: 'AWS Earth Search', url: 'https://earth-search.aws.element84.com/v1' }
];

const mockCollections = [
  { id: 'sentinel-2-l2a', title: 'Sentinel-2 L2A' }
];

const mockOnFiltersChange = jest.fn();

test('renders filter controls', () => {
  render(
    <FilterPanel 
      catalogs={mockCatalogs}
      collections={mockCollections}
      onFiltersChange={mockOnFiltersChange}
    />
  );

  expect(screen.getByText('Search Filters')).toBeInTheDocument();
  expect(screen.getByText('STAC Catalog')).toBeInTheDocument();
  expect(screen.getByText('Collection')).toBeInTheDocument();
});

test('handles date input changes', () => {
  render(
    <FilterPanel 
      catalogs={mockCatalogs}
      collections={mockCollections}
      onFiltersChange={mockOnFiltersChange}
    />
  );

  const startDateInput = screen.getByLabelText(/start date/i);
  fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });
  
  expect(mockOnFiltersChange).toHaveBeenCalled();
});