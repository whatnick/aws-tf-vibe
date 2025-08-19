import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export default function MapComponent({ onAreaSelect, searchedLocation, height = '500px', granules = [] }) {
  const mapRef = useRef();
  const featureGroupRef = useRef();
  const handleCreated = (e) => {
    const { layer } = e;
    const bounds = layer.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(), 
      bounds.getEast(),
      bounds.getNorth()
    ];
    onAreaSelect(bbox);
  };

  useEffect(() => {
    if (searchedLocation && mapRef.current && featureGroupRef.current) {
      const map = mapRef.current;
      const featureGroup = featureGroupRef.current;
      
      // Clear existing layers
      featureGroup.clearLayers();
      
      if (searchedLocation.geometry.type === 'Polygon') {
        // Convert GeoJSON coordinates to Leaflet format
        const coords = searchedLocation.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
        
        // Create and add polygon to map
        const polygon = L.polygon(coords, {
          color: 'red',
          weight: 2,
          fillOpacity: 0.1
        });
        
        featureGroup.addLayer(polygon);
        
        // Fit map to polygon bounds
        map.fitBounds(polygon.getBounds());
        
        // Extract bbox for STAC query
        const bounds = polygon.getBounds();
        const bbox = [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth()
        ];
        onAreaSelect(bbox);
      }
    }
  }, [searchedLocation, onAreaSelect]);

  return (
    <MapContainer
      ref={mapRef}
      center={[0, 0]}
      zoom={2}
      style={{ height, width: '100%', flexGrow: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: true,
            polygon: true,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}