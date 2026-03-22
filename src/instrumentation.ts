
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 1. Define DOMMatrix globally for the Node.js runtime
    // This is required by pdfjs-dist and must be available at start
    if (typeof (global as any).DOMMatrix === 'undefined') {
      console.log('--- Registering DOMMatrix Polyfill (Node.js) ---');
      const MockMatrix = class DOMMatrix {
        constructor() {}
        static fromFloat64Array() { return new MockMatrix(); }
        static fromFloat32Array() { return new MockMatrix(); }
      };
      (global as any).DOMMatrix = MockMatrix;
    }
  }
}
