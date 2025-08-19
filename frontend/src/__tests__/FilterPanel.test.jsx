import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '../components/FilterPanel';

describe('FilterPanel', () => {
  const mockCatalogs = [
    { id: 'earth-search', name: 'AWS Earth Search', url: 'https://earth-search.aws.element84.com/v1' },
    { id: 'usgs-landsat', name: 'USGS Landsat', url: 'https://landsatlook.usgs.gov/stac-server' }
  ];

  const mockCollections = [
    { id: 'sentinel-2-l2a', title: 'Sentinel-2 L2A' },
    { id: 'landsat-c2-l2', title: 'Landsat Collection 2 L2' }
  ];

  const mockOnFiltersChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders filter controls', () => {
    render(
      <FilterPanel 
        catalogs={mockCatalogs}
        collections={mockCollections}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByLabelText(/catalog/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/collection/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cloud cover/i)).toBeInTheDocument();
  });

  test('handles catalog selection', () => {
    render(
      <FilterPanel 
        catalogs={mockCatalogs}
        collections={mockCollections}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const catalogSelect = screen.getByLabelText(/catalog/i);
    fireEvent.change(catalogSelect, { target: { value: 'earth-search' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        catalog: 'https://earth-search.aws.element84.com/v1'
      })
    );
  });

  test('handles collection selection', () => {
    render(
      <FilterPanel 
        catalogs={mockCatalogs}
        collections={mockCollections}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const collectionSelect = screen.getByLabelText(/collection/i);
    fireEvent.change(collectionSelect, { target: { value: 'sentinel-2-l2a' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'sentinel-2-l2a'
      })
    );
  });

  test('handles cloud cover slider', () => {
    render(
      <FilterPanel 
        catalogs={mockCatalogs}
        collections={mockCollections}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const slider = screen.getByLabelText(/cloud cover/i);
    fireEvent.change(slider, { target: { value: '50' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        cloudCover: 50
      })
    );
  });
});