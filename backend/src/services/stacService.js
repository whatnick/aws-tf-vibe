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
  }
};

export { STAC_CATALOGS };