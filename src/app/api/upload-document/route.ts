import { NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    
    // Polyfill for pdf.js internals
    if (typeof (global as unknown as Record<string, unknown>).DOMMatrix === 'undefined') {
        (global as unknown as Record<string, unknown>).DOMMatrix = class DOMMatrix {
            constructor() {}
            static fromFloat64Array() { return new DOMMatrix(); }
            static fromFloat32Array() { return new DOMMatrix(); }
        };
    }

    try {
        const parser = new PDFParse({
            data: Buffer.from(bytes),
            verbosity: 0 
        });

        const result = await parser.getText();
        const text = result.text || "";

        if (typeof (parser as { destroy?: () => Promise<void> }).destroy === 'function') {
            await (parser as { destroy: () => Promise<void> }).destroy();
        }

        return NextResponse.json({ 
            documentType: documentType || 'unknown',
            text: text.trim() 
        });

    } catch (parseError: unknown) {
        console.error('Extraction failed:', parseError);
        const err = parseError as Error;
        return NextResponse.json({ 
            error: 'Parsing Error', 
            details: err.message 
        }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error('Global Error:', error);
    const err = error as Error;
    return NextResponse.json({ 
        error: 'Global Error', 
        details: err.message 
    }, { status: 500 });
  }
}
