import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Definer DOMMatrix med en gang inne i funksjonen for å stoppe krasj
  if (typeof (globalThis as any).DOMMatrix === 'undefined') {
    (globalThis as any).DOMMatrix = class {
      static fromFloat64Array() { return new (globalThis as any).DOMMatrix(); }
      static fromFloat32Array() { return new (globalThis as any).DOMMatrix(); }
    };
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Bruk dynamisk import slik at biblioteket ikke lastes før nå
    const pdf = await import('pdf-parse');
    const parse = pdf.PDFParse || (pdf.default ? (pdf.default as any).PDFParse : null) || pdf.default;

    let text = "";
    
    // 3. Sjekk om det er mehmet-kozan versjonen (klasse) eller standard (funksjon)
    if (typeof parse === 'function' && !parse.prototype?.getText) {
      const data = await (parse as any)(buffer);
      text = data.text;
    } else {
      const parser = new (parse as any)({ data: buffer, verbosity: 0 });
      const result = await parser.getText();
      text = result.text;
      if (typeof (parser as any).destroy === 'function') await (parser as any).destroy();
    }

    return NextResponse.json({ text: (text || "").trim() });

  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
