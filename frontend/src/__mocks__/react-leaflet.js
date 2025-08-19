export const MapContainer = ({ children, ...props }) => <div data-testid="map-container" {...props}>{children}</div>;
export const TileLayer = () => <div data-testid="tile-layer" />;
export const FeatureGroup = ({ children }) => <div data-testid="feature-group">{children}</div>;
export const GeoJSON = () => <div data-testid="geojson" />;