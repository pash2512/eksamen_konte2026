
import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const documentType = formData.get('documentType') as string;

  if (!file) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use pdf-parse to extract text
    const data = await pdf(buffer);

    const response = {
      documentType: documentType || 'unknown',
      text: data.text,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: 'Failed to extract text from PDF.' }, { status: 500 });
  }
}
