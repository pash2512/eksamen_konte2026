
// 1. ABSOLUTE FIRST LINE POLYFILL
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
    console.log('Polyfilling DOMMatrix at module root');
    const MockMatrix = class DOMMatrix {
        constructor() {}
        static fromFloat64Array() { return new MockMatrix(); }
        static fromFloat32Array() { return new MockMatrix(); }
    };
    (global as any).DOMMatrix = MockMatrix;
    (globalThis as any).DOMMatrix = MockMatrix;
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 2. EXTRA SAFETY CHECK INSIDE HANDLER
    if (typeof (globalThis as any).DOMMatrix === 'undefined') {
        console.log('Polyfilling DOMMatrix inside handler');
        const MockMatrix = class DOMMatrix {
            constructor() {}
            static fromFloat64Array() { return new MockMatrix(); }
            static fromFloat32Array() { return new MockMatrix(); }
        };
        (global as any).DOMMatrix = MockMatrix;
        (globalThis as any).DOMMatrix = MockMatrix;
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    console.log(`API Log: Processing file ${file.name}`);

    // 3. DYNAMIC IMPORT
    const pdfLib = await import('pdf-parse');
    const PDFParse = pdfLib.PDFParse || (pdfLib.default ? (pdfLib.default as any).PDFParse : null) || pdfLib.default;

    if (!PDFParse) {
        throw new Error('PDF parsing library failed to load.');
    }

    const buffer = Buffer.from(bytes);
    let text = "";
    let pageCount = 0;

    if (typeof PDFParse === 'function' && !PDFParse.prototype?.getText) {
        const data = await (PDFParse as any)(buffer);
        text = data.text || "";
        pageCount = data.numpages || 0;
    } else {
        const parser = new (PDFParse as any)({
            data: buffer,
            verbosity: 0 
        });

        const result = await parser.getText();
        text = result.text || "";
        pageCount = result.total || 0;

        if (!text.trim() && result.pages) {
            text = (result.pages as Array<{ text?: string }>).map((p) => p.text || "").join("\n");
        }

        if (typeof (parser as any).destroy === 'function') {
            await (parser as any).destroy();
        }
    }

    console.log(`API Log: Extracted ${text.length} chars`);

    return NextResponse.json({ 
        text: text.trim(),
        pageCount: pageCount
    });

  } catch (error: any) {
    console.error('API Global Route Error:', error);
    return NextResponse.json({ 
        error: 'Global Error', 
        details: error.message 
    }, { status: 500 });
  }
}
