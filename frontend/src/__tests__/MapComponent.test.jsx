import { render } from '@testing-library/react';
import MapComponent from '../components/MapComponent';

// Mock Leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }) => <div data-testid="map-container" {...props}>{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  FeatureGroup: ({ children }) => <div data-testid="feature-group">{children}</div>,
  GeoJSON: (props) => <div data-testid="geojson" data-props={JSON.stringify(props)} />
}));

jest.mock('react-leaflet-draw', () => ({
  EditControl: (props) => <div data-testid="edit-control" data-props={JSON.stringify(props)} />
}));

describe('MapComponent', () => {
  const mockOnAreaSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders map container', () => {
    render(<MapComponent onAreaSelect={mockOnAreaSelect} />);
    expect(document.querySelector('[data-testid="map-container"]')).toBeInTheDocument();
  });

  test('renders with custom height', () => {
    render(<MapComponent onAreaSelect={mockOnAreaSelect} height="400px" />);
    const mapContainer = document.querySelector('[data-testid="map-container"]');
    expect(mapContainer).toHaveStyle({ height: '400px' });
  });

  test('renders tile layer and feature group', () => {
    render(<MapComponent onAreaSelect={mockOnAreaSelect} />);
    expect(document.querySelector('[data-testid="tile-layer"]')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="feature-group"]')).toBeInTheDocument();
  });

  test('renders edit control with correct props', () => {
    render(<MapComponent onAreaSelect={mockOnAreaSelect} />);
    const editControl = document.querySelector('[data-testid="edit-control"]');
    expect(editControl).toBeInTheDocument();
    
    const props = JSON.parse(editControl.getAttribute('data-props'));
    expect(props.position).toBe('topright');
    expect(props.draw.rectangle).toBe(true);
    expect(props.draw.polygon).toBe(true);
    expect(props.draw.circle).toBe(false);
  });
});