import request from 'supertest';
import express from 'express';
import axios from 'axios';
import stacRoutes from '../routes/stac.js';

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/api', stacRoutes);

describe('STAC API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/catalogs returns catalog list', async () => {
    const response = await request(app)
      .get('/api/catalogs')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('url');
  });

  test('GET /api/collections returns collections', async () => {
    const mockCollections = [{ id: 'sentinel-2-l2a', title: 'Sentinel-2' }];
    axios.get.mockResolvedValue({ data: { collections: mockCollections } });

    const response = await request(app)
      .get('/api/collections?catalog=https://example.com')
      .expect(200);
    
    expect(response.body).toEqual(mockCollections);
  });

  test('GET /api/geocode requires query parameter', async () => {
    const response = await request(app)
      .get('/api/geocode')
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Query parameter required');
  });

  test('GET /api/geocode returns location data', async () => {
    const mockLocation = {
      features: [{
        properties: { display_name: 'Paris, France' },
        geometry: { type: 'Point', coordinates: [2.3522, 48.8566] },
        bbox: [2.224, 48.815, 2.469, 48.902]
      }]
    };
    axios.get.mockResolvedValue({ data: mockLocation });

    const response = await request(app)
      .get('/api/geocode?q=Paris')
      .expect(200);
    
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('geometry');
  });

  test('POST /api/search returns search results', async () => {
    const mockResults = { features: [{ id: 'item1' }] };
    axios.post.mockResolvedValue({ data: mockResults });

    const searchParams = {
      bbox: [-1, -1, 1, 1],
      catalogUrl: 'https://example.com'
    };

    const response = await request(app)
      .post('/api/search')
      .send(searchParams)
      .expect(200);
    
    expect(response.body).toEqual(mockResults);
  });

  test('POST /api/search/count returns count', async () => {
    const mockResults = { features: [{ id: 'item1' }, { id: 'item2' }] };
    axios.post.mockResolvedValue({ data: mockResults });

    const searchParams = {
      bbox: [-1, -1, 1, 1],
      catalogUrl: 'https://example.com'
    };

    const response = await request(app)
      .post('/api/search/count')
      .send(searchParams)
      .expect(200);
    
    expect(response.body).toHaveProperty('count');
    expect(response.body.count).toBe(2);
  });

  test('POST /api/search/summary returns satellite summary', async () => {
    const mockCollections = [{ id: 'sentinel-2-l2a' }, { id: 'landsat-c2-l2' }];
    const mockResults = { features: [{ id: 'item1' }] };
    
    axios.get.mockResolvedValue({ data: { collections: mockCollections } });
    axios.post.mockResolvedValue({ data: mockResults });

    const searchParams = {
      bbox: [-1, -1, 1, 1],
      catalogUrl: 'https://example.com'
    };

    const response = await request(app)
      .post('/api/search/summary')
      .send(searchParams)
      .expect(200);
    
    expect(response.body).toHaveProperty('sentinel-2');
    expect(response.body).toHaveProperty('landsat');
    expect(response.body).toHaveProperty('total');
  });

  test('handles API errors', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    await request(app)
      .get('/api/collections?catalog=https://example.com')
      .expect(500);
  });
});