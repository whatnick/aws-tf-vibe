import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../services/stacApi', () => ({
  getCatalogs: jest.fn(() => Promise.resolve([])),
  getCollections: jest.fn(() => Promise.resolve([])),
  getItemCount: jest.fn(() => Promise.resolve(0)),
  getSatelliteSummary: jest.fn(() => Promise.resolve({ total: 0 }))
}));

test('renders STAC Granule Lookup Tool title', () => {
  render(<App />);
  const titleElement = screen.getByText(/STAC Granule Lookup Tool/i);
  expect(titleElement).toBeInTheDocument();
});