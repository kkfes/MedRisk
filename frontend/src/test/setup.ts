import '@testing-library/jest-dom/vitest'

// The tests run in jsdom, which does not implement these browser APIs.
// The application itself does not use them, but jsdom logs a warning otherwise.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}
