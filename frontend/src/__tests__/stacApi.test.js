import axios from 'axios';

jest.mock('axios');
jest.mock('../services/stacApi', () => ({
  stacApi: {
    getCatalogs: jest.fn(),
    getCollections: jest.fn(),
    searchItems: jest.fn()
  }
}));

const { stacApi } = require('../services/stacApi');

describe('stacApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCatalogs returns catalog list', async () => {
    const mockCatalogs = [
      { name: 'AWS Earth Search', url: 'https://earth-search.aws.element84.com/v1' }
    ];
    
    axios.get.mockResolvedValue({ data: mockCatalogs });
    
    const result = await stacApi.getCatalogs();
    
    expect(axios.get).toHaveBeenCalledWith('/api/catalogs');
    expect(result).toEqual(mockCatalogs);
  });

  test('getCollections fetches collections for catalog', async () => {
    const mockCollections = [
      { id: 'sentinel-2-l2a', title: 'Sentinel-2 L2A' }
    ];
    
    axios.get.mockResolvedValue({ data: mockCollections });
    
    const result = await stacApi.getCollections('test-catalog');
    
    expect(axios.get).toHaveBeenCalledWith('/api/collections', {
      params: { catalog: 'test-catalog' }
    });
    expect(result).toEqual(mockCollections);
  });

  test('searchItems performs STAC search', async () => {
    const mockItems = { features: [] };
    const searchParams = { bbox: [0, 0, 1, 1] };
    
    axios.post.mockResolvedValue({ data: mockItems });
    
    const result = await stacApi.searchItems(searchParams);
    
    expect(axios.post).toHaveBeenCalledWith('/api/search', searchParams);
    expect(result).toEqual(mockItems);
  });
});