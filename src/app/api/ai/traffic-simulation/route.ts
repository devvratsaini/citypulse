import { NextResponse } from 'next/server';
import { createRoutingService } from '@/lib/routing';

export async function POST(request: Request) {
  try {
    const { route, congestionLevel } = await request.json();

    if (!route || !congestionLevel) {
      return NextResponse.json(
        { message: 'Invalid request. Route and congestionLevel are required.' },
        { status: 400 }
      );
    }

    if (!['low', 'medium', 'high'].includes(congestionLevel)) {
      return NextResponse.json(
        { message: 'Invalid congestion level. Must be low, medium, or high.' },
        { status: 400 }
      );
    }

    const routingService = createRoutingService();
    
    // Simulate traffic conditions
    const simulatedRoute = routingService.simulateTrafficConditions(route, congestionLevel);

    // Generate AI insights
    const insights = generateTrafficInsights(congestionLevel, simulatedRoute);

    return NextResponse.json({
      success: true,
      data: {
        originalRoute: route,
        simulatedRoute,
        insights,
        congestionLevel,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Traffic simulation error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to simulate traffic conditions',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

function generateTrafficInsights(congestionLevel: string, route: any) {
  const summary = route.features[0]?.properties?.summary;
  if (!summary) return [];

  const insights = [];
  const originalDuration = summary.duration / 60; // Convert to minutes
  const congestionMultiplier = {
    low: 1.1,
    medium: 1.5,
    high: 2.0
  }[congestionLevel as keyof typeof congestionMultiplier];

  const newDuration = originalDuration * congestionMultiplier;
  const delay = newDuration - originalDuration;

  insights.push({
    type: 'congestion_detected',
    severity: congestionLevel,
    message: `Traffic congestion detected. Expected delay: ${delay.toFixed(1)} minutes`,
    impact: delay > 5 ? 'high' : delay > 2 ? 'medium' : 'low'
  });

  if (congestionLevel === 'high') {
    insights.push({
      type: 'route_optimization',
      message: 'AI recommends alternative route to avoid major delays',
      action: 'reroute_suggested'
    });
  }

  if (delay > 10) {
    insights.push({
      type: 'emergency_alert',
      message: 'Significant delay detected. Consider deploying additional vehicles.',
      action: 'deploy_backup'
    });
  }

  return insights;
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Traffic Simulation API endpoint',
    usage: 'POST /api/ai/traffic-simulation with { route: RouteObject, congestionLevel: "low" | "medium" | "high" }'
  });
}
