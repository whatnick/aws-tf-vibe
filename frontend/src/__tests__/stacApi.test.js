import axios from 'axios';
import { stacApi } from '../services/stacApi';

jest.mock('axios');

describe('stacApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCatalogs returns catalog data', async () => {
    const mockCatalogs = [
      { id: 'earth-search', name: 'AWS Earth Search', url: 'https://earth-search.aws.element84.com/v1' }
    ];
    axios.get.mockResolvedValue({ data: mockCatalogs });

    const result = await stacApi.getCatalogs();
    
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/catalogs'));
    expect(result).toEqual(mockCatalogs);
  });

  test('geocodeLocation returns location data', async () => {
    const mockLocation = {
      name: 'Paris, France',
      geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }
    };
    axios.get.mockResolvedValue({ data: mockLocation });

    const result = await stacApi.geocodeLocation('Paris');
    
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/geocode'),
      expect.objectContaining({
        params: { q: 'Paris' }
      })
    );
    expect(result).toEqual(mockLocation);
  });

  test('getCollections returns collections data', async () => {
    const mockCollections = [
      { id: 'sentinel-2-l2a', title: 'Sentinel-2 L2A' }
    ];
    axios.get.mockResolvedValue({ data: mockCollections });

    const result = await stacApi.getCollections('https://example.com');
    
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/collections'),
      expect.objectContaining({
        params: { catalog: 'https://example.com' }
      })
    );
    expect(result).toEqual(mockCollections);
  });

  test('searchItems returns search results', async () => {
    const mockResults = { features: [{ id: 'item1' }] };
    axios.post.mockResolvedValue({ data: mockResults });

    const bbox = [-1, -1, 1, 1];
    const filters = { collection: 'sentinel-2-l2a' };
    const result = await stacApi.searchItems(bbox, filters);
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/search'),
      expect.objectContaining({
        bbox,
        ...filters
      })
    );
    expect(result).toEqual(mockResults);
  });

  test('getItemCount returns count', async () => {
    axios.post.mockResolvedValue({ data: { count: 42 } });

    const bbox = [-1, -1, 1, 1];
    const filters = { collection: 'sentinel-2-l2a' };
    const result = await stacApi.getItemCount(bbox, filters);
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/search/count'),
      expect.objectContaining({
        bbox,
        ...filters
      })
    );
    expect(result).toBe(42);
  });

  test('getSatelliteSummary returns summary', async () => {
    const mockSummary = { 'sentinel-2': 100, 'landsat': 50, 'other': 10, 'total': 160 };
    axios.post.mockResolvedValue({ data: mockSummary });

    const bbox = [-1, -1, 1, 1];
    const filters = { catalogUrl: 'https://example.com' };
    const result = await stacApi.getSatelliteSummary(bbox, filters);
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/search/summary'),
      expect.objectContaining({
        bbox,
        ...filters
      })
    );
    expect(result).toEqual(mockSummary);
  });
});