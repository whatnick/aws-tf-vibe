import axios from 'axios';
import { simplify } from '@turf/simplify';
import { polygon } from '@turf/helpers';

export const geocodingService = {
  async searchLocation(query) {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'geojson',
        polygon_geojson: 1,
        limit: 1
      },
      headers: {
        'User-Agent': 'STAC-Lookup-App/1.0'
      }
    });

    if (!response.data.features.length) {
      throw new Error('Location not found');
    }

    const feature = response.data.features[0];
    let geometry = feature.geometry;

    // Simplify polygon if it has too many points
    if (geometry.type === 'Polygon' && geometry.coordinates[0].length > 100) {
      const simplified = simplify(polygon(geometry.coordinates), {
        tolerance: 0.01,
        highQuality: false
      });
      geometry = simplified.geometry;
    }

    return {
      name: feature.properties.display_name,
      geometry,
      bbox: feature.bbox
    };
  }
};