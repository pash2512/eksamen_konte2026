import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Call the Cloudflare Worker backend
    const workerUrl = "https://secure-openai-backend.jehad-khattak2512.workers.dev/api/analyze";
    
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cvText: body.cvText,
        applicationText: body.applicationText,
        jobDescription: body.jobDescription,
        tone: body.tone,
        seniority: body.seniority,
      }),
    });

    const responseText = await response.text();
    console.log('Raw Worker Response:', responseText);
    
    if (!response.ok) {
        console.error('Worker Error Response:', responseText);
        let errorMsg = "Backend worker error";
        try {
            const errorData = JSON.parse(responseText);
            errorMsg = errorData.error || errorMsg;
        } catch {
            errorMsg = responseText || errorMsg;
        }
        throw new Error(errorMsg);
    }

    try {
        return NextResponse.json(JSON.parse(responseText));
    } catch {
        console.error('Failed to parse worker JSON:', responseText);
        throw new Error("Invalid JSON response from backend");
    }

  } catch (error) {
    console.error('Error in analysis proxy:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to get analysis from backend.', details: errorMessage }, { status: 500 });
  }
}
