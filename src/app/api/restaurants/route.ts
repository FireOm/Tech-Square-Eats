import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the location query parameter from the request
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    // Validate that location parameter is provided
    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    // Get the Python backend URL from environment variables
    const backendUrl = process.env.PYTHON_BACKEND_URL;
    
    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    // Construct the backend API URL with the location parameter
    const backendApiUrl = `${backendUrl}/api/restaurants?location=${encodeURIComponent(location)}`;

    // Forward the request to the Python backend
    const response = await fetch(backendApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the backend request was successful
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Parse the JSON response from the backend
    const data = await response.json();

    // Return the data from the Python backend
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    
    // Return a generic error message to the client
    return NextResponse.json(
      { error: 'Failed to fetch restaurants. Please try again later.' },
      { status: 500 }
    );
  }
}
