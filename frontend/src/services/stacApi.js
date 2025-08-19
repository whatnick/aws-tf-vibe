import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const stacApi = {
  async getCatalogs() {
    const response = await axios.get(`${API_BASE}/catalogs`);
    return response.data;
  },

  async geocodeLocation(query) {
    const response = await axios.get(`${API_BASE}/geocode`, {
      params: { q: query }
    });
    return response.data;
  },

  async getCollections(catalogUrl) {
    const response = await axios.get(`${API_BASE}/collections`, {
      params: { catalog: catalogUrl }
    });
    return response.data;
  },

  async searchItems(bbox, filters) {
    const response = await axios.post(`${API_BASE}/search`, {
      bbox,
      ...filters
    });
    return response.data;
  },

  async getItemCount(bbox, filters) {
    const response = await axios.post(`${API_BASE}/search/count`, {
      bbox,
      ...filters
    });
    return response.data.count;
  },

  async getSatelliteSummary(bbox, filters) {
    const response = await axios.post(`${API_BASE}/search/summary`, {
      bbox,
      ...filters
    });
    return response.data;
  }
};

export default stacApi;