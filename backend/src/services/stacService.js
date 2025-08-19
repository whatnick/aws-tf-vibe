import axios from 'axios';

const STAC_CATALOGS = {
  'earth-search': 'https://earth-search.aws.element84.com/v1',
  'usgs-landsat': 'https://landsatlook.usgs.gov/stac-server'
};

const DEFAULT_ENDPOINT = STAC_CATALOGS['earth-search'];

export const stacService = {
  getCatalogs() {
    return Object.entries(STAC_CATALOGS).map(([key, url]) => ({
      id: key,
      name: key === 'earth-search' ? 'AWS Earth Search' : 'USGS Landsat',
      url
    }));
  },

  async getCollections(catalogUrl = DEFAULT_ENDPOINT) {
    const response = await axios.get(`${catalogUrl}/collections`);
    return response.data.collections || [];
  },

  async searchItems({ bbox, collection, startDate, endDate, cloudCover, catalogUrl = DEFAULT_ENDPOINT }) {
    const searchUrl = `${catalogUrl}/search`;
    
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
    return response.data;
  },

  async getItemCount(params) {
    const results = await this.searchItems(params);
    return results.features?.length || 0;
  },

  async getSatelliteSummary({ bbox, startDate, endDate, cloudCover, catalogUrl = DEFAULT_ENDPOINT }) {
    const baseParams = { bbox, startDate, endDate, cloudCover, catalogUrl };
    
    const satelliteCollections = {
      'sentinel-2': ['sentinel-2-l2a', 'sentinel-2-l1c', 'sentinel-s2-l2a-cogs'],
      'landsat': ['landsat-c2-l2', 'landsat-c2-l1', 'landsat-8-c1-l1', 'landsat-7-c1-l1']
    };

    const summary = {
      'sentinel-2': 0,
      'landsat': 0,
      'other': 0,
      'total': 0
    };

    try {
      const collections = await this.getCollections(catalogUrl);
      
      for (const [satellite, collectionIds] of Object.entries(satelliteCollections)) {
        for (const collectionId of collectionIds) {
          if (collections.find(c => c.id === collectionId)) {
            try {
              const count = await this.getItemCount({ ...baseParams, collection: collectionId });
              summary[satellite] += count;
            } catch (error) {
              console.warn(`Failed to get count for ${collectionId}`);
            }
          }
        }
      }

      const knownCollections = [...satelliteCollections['sentinel-2'], ...satelliteCollections['landsat']];
      for (const collection of collections) {
        if (!knownCollections.includes(collection.id)) {
          try {
            const count = await this.getItemCount({ ...baseParams, collection: collection.id });
            summary.other += count;
          } catch (error) {
            console.warn(`Failed to get count for ${collection.id}`);
          }
        }
      }

      summary.total = summary['sentinel-2'] + summary['landsat'] + summary.other;
      return summary;
    } catch (error) {
      return summary;
    }
  }
};

export { STAC_CATALOGS };