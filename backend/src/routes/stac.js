import express from 'express';
import { stacService } from '../services/stacService.js';
import { geocodingService } from '../services/geocodingService.js';

const router = express.Router();

router.get('/catalogs', async (req, res) => {
  try {
    const catalogs = stacService.getCatalogs();
    res.json(catalogs);
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
    const result = await geocodingService.searchLocation(q);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/collections', async (req, res) => {
  try {
    const { catalog } = req.query;
    const catalogUrl = catalog || process.env.DEFAULT_STAC_ENDPOINT;
    const collections = await stacService.getCollections(catalogUrl);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { bbox, collection, startDate, endDate, cloudCover, catalogUrl } = req.body;
    const results = await stacService.searchItems({
      bbox,
      collection,
      startDate,
      endDate,
      cloudCover,
      catalogUrl
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/search/count', async (req, res) => {
  try {
    const { bbox, collection, startDate, endDate, cloudCover, catalogUrl } = req.body;
    const count = await stacService.getItemCount({
      bbox,
      collection,
      startDate,
      endDate,
      cloudCover,
      catalogUrl
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;