import { NextResponse } from 'next/server';

// Robust polyfill for DOMMatrix - MUST be at the absolute top
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
    const MockMatrix = class DOMMatrix {
        constructor() {}
        static fromFloat64Array() { return new MockMatrix(); }
        static fromFloat32Array() { return new MockMatrix(); }
    };
    (global as any).DOMMatrix = MockMatrix;
    (globalThis as any).DOMMatrix = MockMatrix;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    
    // Safety check inside handler
    if (typeof (globalThis as any).DOMMatrix === 'undefined') {
        const MockMatrix = class DOMMatrix {
            constructor() {}
            static fromFloat64Array() { return new MockMatrix(); }
            static fromFloat32Array() { return new MockMatrix(); }
        };
        (global as any).DOMMatrix = MockMatrix;
        (globalThis as any).DOMMatrix = MockMatrix;
    }

    // Dynamic import to ensure polyfill is applied
    const pdfLib = await import('pdf-parse');
    const PDFParse = pdfLib.PDFParse || (pdfLib.default ? (pdfLib.default as any).PDFParse : null) || pdfLib.default;

    if (!PDFParse) {
        throw new Error('PDF parsing library failed to load.');
    }

    try {
        const buffer = Buffer.from(bytes);
        let text = "";

        if (typeof PDFParse === 'function' && !PDFParse.prototype?.getText) {
            const data = await (PDFParse as any)(buffer);
            text = data.text || "";
        } else {
            const parser = new (PDFParse as any)({
                data: buffer,
                verbosity: 0 
            });

            const result = await parser.getText();
            text = result.text || "";

            if (typeof (parser as any).destroy === 'function') {
                await (parser as any).destroy();
            }
        }

        return NextResponse.json({ 
            documentType: documentType || 'unknown',
            text: text.trim() 
        });

    } catch (parseError: any) {
        console.error('Extraction failed:', parseError);
        return NextResponse.json({ 
            error: 'Parsing Error', 
            details: parseError.message 
        }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Global Error:', error);
    return NextResponse.json({ 
        error: 'Global Error', 
        details: error.message 
    }, { status: 500 });
  }
}
