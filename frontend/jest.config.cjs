module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-leaflet$': '<rootDir>/src/__mocks__/react-leaflet.js',
    '^react-leaflet-draw$': '<rootDir>/src/__mocks__/react-leaflet-draw.js',
    '^leaflet$': '<rootDir>/src/__mocks__/leaflet.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-leaflet|@react-leaflet)/)',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:3001/api',
        VITE_MAP_DEFAULT_CENTER: '[0,0]',
        VITE_MAP_DEFAULT_ZOOM: '2'
      }
    }
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/src/**/?(*.)(test|spec).(js|jsx)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }

};