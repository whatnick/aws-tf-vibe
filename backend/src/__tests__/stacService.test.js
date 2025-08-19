import axios from 'axios';
import { stacService } from '../services/stacService.js';

jest.mock('axios');

describe('STAC Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCatalogs returns array of catalogs', () => {
    const catalogs = stacService.getCatalogs();
    
    expect(Array.isArray(catalogs)).toBe(true);
    expect(catalogs.length).toBeGreaterThan(0);
    expect(catalogs[0]).toHaveProperty('id');
    expect(catalogs[0]).toHaveProperty('name');
    expect(catalogs[0]).toHaveProperty('url');
  });

  test('getCollections returns collections', async () => {
    const mockCollections = [{ id: 'sentinel-2-l2a', title: 'Sentinel-2' }];
    axios.get.mockResolvedValue({ data: { collections: mockCollections } });

    const result = await stacService.getCollections('https://example.com');
    
    expect(axios.get).toHaveBeenCalledWith('https://example.com/collections');
    expect(result).toEqual(mockCollections);
  });

  test('searchItems returns search results', async () => {
    const mockResults = { features: [{ id: 'item1' }] };
    axios.post.mockResolvedValue({ data: mockResults });

    const params = {
      bbox: [-1, -1, 1, 1],
      collection: 'sentinel-2-l2a',
      catalogUrl: 'https://example.com'
    };

    const result = await stacService.searchItems(params);
    
    expect(axios.post).toHaveBeenCalledWith(
      'https://example.com/search',
      expect.objectContaining({
        bbox: [-1, -1, 1, 1],
        collections: ['sentinel-2-l2a']
      })
    );
    expect(result).toEqual(mockResults);
  });

  test('getItemCount returns count', async () => {
    const mockResults = { features: [{ id: 'item1' }, { id: 'item2' }] };
    axios.post.mockResolvedValue({ data: mockResults });

    const params = { bbox: [-1, -1, 1, 1], catalogUrl: 'https://example.com' };
    const result = await stacService.getItemCount(params);
    
    expect(result).toBe(2);
  });

  test('getSatelliteSummary returns summary object', async () => {
    const mockCollections = [
      { id: 'sentinel-2-l2a' },
      { id: 'landsat-c2-l2' },
      { id: 'other-collection' }
    ];
    const mockSearchResults = { features: [{ id: 'item1' }] };
    
    axios.get.mockResolvedValue({ data: { collections: mockCollections } });
    axios.post.mockResolvedValue({ data: mockSearchResults });

    const params = {
      bbox: [-1, -1, 1, 1],
      catalogUrl: 'https://example.com'
    };

    const summary = await stacService.getSatelliteSummary(params);
    
    expect(summary).toHaveProperty('sentinel-2');
    expect(summary).toHaveProperty('landsat');
    expect(summary).toHaveProperty('other');
    expect(summary).toHaveProperty('total');
    expect(typeof summary.total).toBe('number');
  });

  test('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    await expect(stacService.getCollections('https://example.com'))
      .rejects.toThrow('Network error');
  });
});