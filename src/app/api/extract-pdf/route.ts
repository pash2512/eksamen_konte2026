import { NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    
    // Polyfill for pdf.js internals
    if (typeof (global as any).DOMMatrix === 'undefined') {
        (global as any).DOMMatrix = class DOMMatrix {
            constructor() {}
            static fromFloat64Array() { return new DOMMatrix(); }
            static fromFloat32Array() { return new DOMMatrix(); }
        };
    }

    // Set worker source to legacy build for compatibility in Node.js
    const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

    try {
        console.log(`Starting extraction for ${file.name} using v2.4.5 with manual worker...`);
        
        const parser = new PDFParse({
            data: Buffer.from(bytes),
            verbosity: 0 
        });

        // Use the getText() method
        const result = await parser.getText();
        
        let text = result.text || "";
        const numPages = result.total || 0;

        // Final safety check: if text is still empty, let's try to see if result.pages has anything
        if (!text.trim() && result.pages) {
            text = result.pages.map((p: any) => p.text || "").join("\n");
        }

        console.log(`Extracted ${text.length} characters from ${numPages} pages.`);

        // Clean up the parser
        if (typeof parser.destroy === 'function') {
            await parser.destroy();
        }

        return NextResponse.json({ 
            text: text.trim(),
            pageCount: numPages
        });

    } catch (parseError: any) {
        console.error('Extraction failed:', parseError);
        // If it fails due to worker path, try a CDN or a simpler require fallback
        return NextResponse.json({ 
            error: 'Parsing Error', 
            details: parseError.message,
            stack: parseError.stack
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
