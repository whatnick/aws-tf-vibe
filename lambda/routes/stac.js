const express = require('express');
const axios = require('axios');
const { simplify } = require('@turf/simplify');
const { polygon } = require('@turf/helpers');

const router = express.Router();

const STAC_CATALOGS = {
  'earth-search': 'https://earth-search.aws.element84.com/v1',
  'usgs-landsat': 'https://landsatlook.usgs.gov/stac-server'
};

const DEFAULT_ENDPOINT = STAC_CATALOGS['earth-search'];

router.get('/catalogs', (req, res) => {
  const catalogs = Object.entries(STAC_CATALOGS).map(([key, url]) => ({
    id: key,
    name: key === 'earth-search' ? 'AWS Earth Search' : 'USGS Landsat',
    url
  }));
  res.json(catalogs);
});

router.get('/collections', async (req, res) => {
  try {
    const { catalog } = req.query;
    const catalogUrl = catalog || DEFAULT_ENDPOINT;
    const response = await axios.get(`${catalogUrl}/collections`);
    res.json(response.data.collections || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q,
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

    if (geometry.type === 'Polygon' && geometry.coordinates[0].length > 100) {
      const simplified = simplify(polygon(geometry.coordinates), {
        tolerance: 0.01,
        highQuality: false
      });
      geometry = simplified.geometry;
    }

    res.json({
      name: feature.properties.display_name,
      geometry,
      bbox: feature.bbox
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { bbox, collection, startDate, endDate, cloudCover, catalogUrl } = req.body;
    const searchUrl = `${catalogUrl || DEFAULT_ENDPOINT}/search`;
    
    const searchParams = {
      limit: 50,
      ...(bbox && { bbox }),
      ...(collection && { collections: [collection] }),
      ...(startDate && endDate && {
        datetime: `${startDate}/${endDate}`
      }),
      ...(cloudCover < 100 && {
        query: {
          'eo:cloud_cover': { lt: cloudCover }
        }
      })
    };

    const response = await axios.post(searchUrl, searchParams);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/search/count', async (req, res) => {
  try {
    const { bbox, collection, startDate, endDate, cloudCover, catalogUrl } = req.body;
    const searchUrl = `${catalogUrl || DEFAULT_ENDPOINT}/search`;
    
    const searchParams = {
      limit: 50,
      ...(bbox && { bbox }),
      ...(collection && { collections: [collection] }),
      ...(startDate && endDate && {
        datetime: `${startDate}/${endDate}`
      }),
      ...(cloudCover < 100 && {
        query: {
          'eo:cloud_cover': { lt: cloudCover }
        }
      })
    };

    const response = await axios.post(searchUrl, searchParams);
    res.json({ count: response.data.features?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;