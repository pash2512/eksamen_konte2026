
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  const body = await request.json();
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to find a 'main' element, otherwise fall back to 'body'
    const mainContent = $('main').length ? $('main') : $('body');
    
    // Remove script and style tags
    mainContent.find('script, style, nav, footer, header, aside').remove();
    
    const textContent = mainContent.text();
    
    // A simple way to clean up the text: replace multiple newlines/spaces
    const cleanedText = textContent.replace(/\s\s+/g, ' ').trim();
    
    const extractedData = {
      title: $('title').first().text() || 'Job Posting',
      content: cleanedText,
    };

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error('Error extracting from URL:', error);
    return NextResponse.json({ error: 'Failed to extract content from URL.' }, { status: 500 });
  }
}
