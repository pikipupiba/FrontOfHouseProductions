// Import jest-dom for DOM testing extensions
require('@testing-library/jest-dom');

// Global mocks and configurations for tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Silence console errors/warnings during tests
// Comment these out when debugging tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Setup mock for window.fetch that will be used by MSW
global.fetch = jest.fn();
