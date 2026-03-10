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
    console.log(`Received file ${file.name}, size: ${bytes.byteLength} bytes.`);

    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }
    
    // Polyfill for pdf.js internals
    if (typeof (global as unknown as Record<string, unknown>).DOMMatrix === 'undefined') {
        (global as unknown as Record<string, unknown>).DOMMatrix = class DOMMatrix {
            constructor() {}
            static fromFloat64Array() { return new DOMMatrix(); }
            static fromFloat32Array() { return new DOMMatrix(); }
        };
    }

    // Set worker source to legacy build for compatibility in Node.js
    const pdfjsVersion = "5.4.296"; // Hardcoded from npm list
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/legacy/build/pdf.worker.min.mjs`;

    try {
        console.log(`Starting extraction using pdf-parse 2.4.5 with CDN worker version ${pdfjsVersion}...`);
        
        const parser = new PDFParse({
            data: Buffer.from(bytes),
            verbosity: 0 
        });

        // Use the getText() method
        console.log('Requesting text extraction...');
        const result = await parser.getText();
        console.log('Text extraction complete.');
        
        let text = result.text || "";
        const numPages = result.total || 0;

        // Final safety check: if text is still empty, let's try to see if result.pages has anything
        if (!text.trim() && result.pages) {
            console.log('Main text field empty, checking individual pages...');
            text = (result.pages as Array<{ text?: string }>).map((p) => p.text || "").join("\n");
        }

        console.log(`Extracted ${text.length} characters from ${numPages} pages.`);

        // Clean up the parser
        if (typeof (parser as { destroy?: () => Promise<void> }).destroy === 'function') {
            console.log('Cleaning up parser...');
            await (parser as { destroy: () => Promise<void> }).destroy();
        }

        return NextResponse.json({ 
            text: text.trim(),
            pageCount: numPages
        });

    } catch (parseError: unknown) {
        console.error('Extraction failed inside try/catch:', parseError);
        const err = parseError as Error;
        return NextResponse.json({ 
            error: 'Parsing Error', 
            details: err.message,
            stack: err.stack
        }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error('Global Route Error:', error);
    const err = error as Error;
    return NextResponse.json({ 
        error: 'Global Error', 
        details: err.message,
        stack: err.stack
    }, { status: 500 });
  }
}
