import { NextResponse } from 'next/server';
import { createRoutingService } from '@/lib/routing';

export async function POST(request: Request) {
  try {
    const { start, hospitals, avoidTraffic } = await request.json();

    if (!start || !hospitals || !Array.isArray(hospitals)) {
      return NextResponse.json(
        { message: 'Invalid request. Start position and hospitals array are required.' },
        { status: 400 }
      );
    }

    const routingService = createRoutingService();
    
    // Get the best route to the most suitable hospital
    const result = await routingService.getOptimizedRoute(
      start,
      hospitals,
      avoidTraffic
    );

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Routing error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to calculate route',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Emergency routing API endpoint',
    usage: 'POST /api/emergency/route with { start: [lat, lng], hospitals: [{ position: [lat, lng], priority: number }], avoidTraffic: boolean }'
  });
}
