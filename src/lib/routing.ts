interface RouteRequest {
  start: [number, number];
  end: [number, number];
  profile: 'driving-car' | 'driving-hgv' | 'cycling-regular' | 'foot-walking';
  options?: {
    avoid_features?: string[];
    avoid_borders?: string;
    avoid_countries?: string[];
  };
}

interface RouteResponse {
  type: string;
  features: Array<{
    type: string;
    properties: {
      segments: Array<{
        distance: number;
        duration: number;
        steps: Array<{
          distance: number;
          duration: number;
          instruction: string;
          name: string;
          way_points: number[];
        }>;
      }>;
      summary: {
        distance: number;
        duration: number;
      };
    };
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
  }>;
  bbox: [number, number, number, number];
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: any;
  };
}

export class RoutingService {
  private apiKey: string;
  private baseUrl = 'https://api.openrouteservice.org/v2/directions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getRoute(request: RouteRequest): Promise<RouteResponse> {
    const response = await fetch(`${this.baseUrl}/${request.profile}/geojson`, {
      method: 'POST',
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [request.start, request.end],
        options: request.options || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Routing API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getOptimizedRoute(
    start: [number, number],
    hospitals: Array<{ position: [number, number]; priority: number }>,
    avoidTraffic: boolean = false
  ): Promise<{
    bestRoute: RouteResponse;
    bestHospital: { position: [number, number]; priority: number };
    alternatives: Array<{ route: RouteResponse; hospital: { position: [number, number]; priority: number } }>;
  }> {
    const options = avoidTraffic ? {
      avoid_features: ['highways', 'tollways'],
      avoid_borders: 'all'
    } : {};

    const routePromises = hospitals.map(async (hospital) => {
      try {
        const route = await this.getRoute({
          start,
          end: hospital.position,
          profile: 'driving-car',
          options
        });

        return {
          route,
          hospital,
          score: this.calculateRouteScore(route, hospital.priority)
        };
      } catch (error) {
        console.error(`Failed to get route to hospital at ${hospital.position}:`, error);
        return null;
      }
    });

    const results = (await Promise.all(routePromises)).filter(Boolean);
    
    if (results.length === 0) {
      throw new Error('No valid routes found to any hospital');
    }

    // Sort by score (lower is better)
    results.sort((a, b) => a!.score - b!.score);

    const best = results[0]!;
    const alternatives = results.slice(1, 4); // Top 3 alternatives

    return {
      bestRoute: best.route,
      bestHospital: best.hospital,
      alternatives: alternatives.map(alt => ({
        route: alt!.route,
        hospital: alt!.hospital
      }))
    };
  }

  private calculateRouteScore(route: RouteResponse, priority: number): number {
    const summary = route.features[0]?.properties?.summary;
    if (!summary) return Infinity;

    // Lower score is better
    // Factor in duration (minutes), distance (km), and hospital priority
    const durationScore = summary.duration / 60; // Convert to minutes
    const distanceScore = summary.distance / 1000; // Convert to km
    const priorityScore = (10 - priority) * 2; // Higher priority = lower score

    return durationScore + (distanceScore * 0.1) + priorityScore;
  }

  // Simulate AI traffic prediction
  simulateTrafficConditions(route: RouteResponse, congestionLevel: 'low' | 'medium' | 'high'): RouteResponse {
    const multiplier = {
      low: 1.1,
      medium: 1.5,
      high: 2.0
    }[congestionLevel];

    const modifiedRoute = JSON.parse(JSON.stringify(route)); // Deep clone
    
    if (modifiedRoute.features[0]?.properties?.summary) {
      modifiedRoute.features[0].properties.summary.duration *= multiplier;
      
      // Update segment durations
      modifiedRoute.features[0].properties.segments?.forEach((segment: any) => {
        segment.duration *= multiplier;
        segment.steps?.forEach((step: any) => {
          step.duration *= multiplier;
        });
      });
    }

    return modifiedRoute;
  }
}

// Mock routing service for development/demo purposes
export class MockRoutingService {
  async getOptimizedRoute(
    start: [number, number],
    hospitals: Array<{ position: [number, number]; priority: number }>,
    avoidTraffic: boolean = false
  ): Promise<{
    bestRoute: any;
    bestHospital: { position: [number, number]; priority: number };
    alternatives: Array<{ route: any; hospital: { position: [number, number]; priority: number } }>;
  }> {
    // Find the closest hospital by priority
    const sortedHospitals = hospitals.sort((a, b) => b.priority - a.priority);
    const bestHospital = sortedHospitals[0];
    
    // Calculate simple distance-based route
    const distance = this.calculateDistance(start, bestHospital.position);
    const duration = avoidTraffic ? distance * 2 : distance * 1.5; // Mock duration in seconds
    
    const mockRoute = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          summary: {
            distance: distance * 1000, // Convert to meters
            duration: duration
          }
        },
        geometry: {
          type: 'LineString',
          coordinates: [start, bestHospital.position]
        }
      }]
    };

    return {
      bestRoute: mockRoute,
      bestHospital,
      alternatives: sortedHospitals.slice(1, 3).map(hospital => ({
        route: {
          ...mockRoute,
          features: [{
            ...mockRoute.features[0],
            geometry: {
              ...mockRoute.features[0].geometry,
              coordinates: [start, hospital.position]
            }
          }]
        },
        hospital
      }))
    };
  }

  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Simulate traffic conditions for Pune
  simulateTrafficConditions(route: any, congestionLevel: 'low' | 'medium' | 'high'): any {
    const multiplier = {
      low: 1.1,
      medium: 1.5,
      high: 2.0
    }[congestionLevel];

    const modifiedRoute = JSON.parse(JSON.stringify(route)); // Deep clone
    
    if (modifiedRoute.features[0]?.properties?.summary) {
      modifiedRoute.features[0].properties.summary.duration *= multiplier;
      
      // Update segment durations
      modifiedRoute.features[0].properties.segments?.forEach((segment: any) => {
        segment.duration *= multiplier;
        segment.steps?.forEach((step: any) => {
          step.duration *= multiplier;
        });
      });
    }

    return modifiedRoute;
  }
}

// Factory function to create routing service
export function createRoutingService(): RoutingService | MockRoutingService {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey || apiKey === 'your-openroute-service-api-key-here') {
    console.warn('ORS_API_KEY not configured. Using mock routing service.');
    return new MockRoutingService();
  }
  return new RoutingService(apiKey);
}
