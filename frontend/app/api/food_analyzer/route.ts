import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    console.log('🔄 Proxying food analysis request to FastAPI backend...');
    
    // Forward the request to your FastAPI backend
    const backendResponse = await fetch('http://localhost:8000/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!backendResponse.ok) {
      console.error(`❌ Backend responded with status: ${backendResponse.status}`);
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend server error: ${backendResponse.status}` 
        },
        { status: backendResponse.status }
      );
    }
    
    // Get the response from FastAPI
    const result = await backendResponse.json();
    
    console.log('✅ Food analysis completed successfully');
    
    // Return the result to the frontend
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Food analyzer proxy error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}