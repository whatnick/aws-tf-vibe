import axios from 'axios';
import { geocodingService } from '../services/geocodingService.js';

jest.mock('axios');

describe('geocodingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('searchLocation returns simplified polygon', async () => {
    const mockResponse = {
      data: {
        features: [{
          properties: { display_name: 'Paris, France' },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [2.224, 48.815], [2.224, 48.902], [2.469, 48.902], [2.469, 48.815], [2.224, 48.815]
            ]]
          },
          bbox: [2.224, 48.815, 2.469, 48.902]
        }]
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await geocodingService.searchLocation('Paris');

    expect(axios.get).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/search',
      expect.objectContaining({
        params: {
          q: 'Paris',
          format: 'geojson',
          polygon_geojson: 1,
          limit: 1
        },
        headers: {
          'User-Agent': 'STAC-Lookup-App/1.0'
        }
      })
    );

    expect(result).toEqual({
      name: 'Paris, France',
      geometry: expect.objectContaining({
        type: 'Polygon'
      }),
      bbox: [2.224, 48.815, 2.469, 48.902]
    });
  });

  test('throws error when location not found', async () => {
    axios.get.mockResolvedValue({ data: { features: [] } });

    await expect(geocodingService.searchLocation('InvalidLocation'))
      .rejects.toThrow('Location not found');
  });

  test('handles API errors', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    await expect(geocodingService.searchLocation('Paris'))
      .rejects.toThrow('Network error');
  });
});