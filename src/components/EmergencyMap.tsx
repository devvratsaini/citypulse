"use client";

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EmergencyMapProps {
  trafficSimulation: boolean;
}

interface Route {
  id: string;
  start: [number, number];
  end: [number, number];
  waypoints: [number, number][];
  duration: number;
  distance: number;
  isOptimized: boolean;
}

interface Hospital {
  id: string;
  name: string;
  position: [number, number];
  capacity: number;
  availableBeds: number;
}

interface EmergencyVehicle {
  id: string;
  position: [number, number];
  status: 'available' | 'en-route' | 'busy';
  destination?: [number, number];
}

// Custom hook to handle map updates
function MapUpdater({ trafficSimulation }: { trafficSimulation: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (trafficSimulation) {
      // Simulate traffic congestion by changing map style
      map.setView([18.5204, 73.8567], 12);
    }
  }, [trafficSimulation, map]);

  return null;
}

export default function EmergencyMap({ trafficSimulation }: EmergencyMapProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [vehicles, setVehicles] = useState<EmergencyVehicle[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Sample data for demonstration
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recalculate routes when traffic simulation changes
  useEffect(() => {
    if (hospitals.length > 0 && vehicles.length > 0) {
      calculateOptimalRoutes();
    }
  }, [trafficSimulation, hospitals, vehicles]);

  // Simulate AI traffic prediction and route optimization
  const simulateAITrafficPrediction = async (route: Route) => {
    try {
      const response = await fetch('/api/ai/traffic-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: {
            features: [{
              type: 'Feature',
              properties: {
                summary: {
                  duration: route.duration * 60, // Convert to seconds
                  distance: route.distance * 1000 // Convert to meters
                }
              },
              geometry: {
                type: 'LineString',
                coordinates: [route.start, ...route.waypoints, route.end]
              }
            }]
          },
          congestionLevel: trafficSimulation ? 'high' : 'low'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('AI traffic simulation failed:', error);
    }
    return null;
  };

  const loadInitialData = () => {
    // Sample hospitals in Pune, India
    const sampleHospitals: Hospital[] = [
      {
        id: '1',
        name: 'Sassoon General Hospital',
        position: [18.5204, 73.8567],
        capacity: 200,
        availableBeds: 45
      },
      {
        id: '2',
        name: 'Ruby Hall Clinic',
        position: [18.5084, 73.8567],
        capacity: 150,
        availableBeds: 23
      },
      {
        id: '3',
        name: 'Jehangir Hospital',
        position: [18.5324, 73.8567],
        capacity: 100,
        availableBeds: 67
      },
      {
        id: '4',
        name: 'Apollo Hospital',
        position: [18.5244, 73.8467],
        capacity: 120,
        availableBeds: 34
      }
    ];

    // Sample emergency vehicles in Pune
    const sampleVehicles: EmergencyVehicle[] = [
      {
        id: '1',
        position: [18.5204, 73.8567],
        status: 'available'
      },
      {
        id: '2',
        position: [18.5084, 73.8567],
        status: 'en-route',
        destination: [18.5204, 73.8567]
      },
      {
        id: '3',
        position: [18.5324, 73.8567],
        status: 'busy'
      },
      {
        id: '4',
        position: [18.5244, 73.8467],
        status: 'available'
      }
    ];

    setHospitals(sampleHospitals);
    setVehicles(sampleVehicles);
  };

  const calculateOptimalRoutes = async () => {
    setIsCalculatingRoute(true);
    setRouteError(null);

    try {
      const availableVehicles = vehicles.filter(v => v.status === 'available');
      if (availableVehicles.length === 0) {
        setRouteError('No available vehicles for routing');
        return;
      }

      const hospitalData = hospitals.map(h => ({
        position: h.position,
        priority: Math.round((h.availableBeds / h.capacity) * 10) // Higher priority for more available beds
      }));

      const routePromises = availableVehicles.map(async (vehicle) => {
        try {
          const response = await fetch('/api/emergency/route', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start: vehicle.position,
              hospitals: hospitalData,
              avoidTraffic: trafficSimulation
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          return {
            id: vehicle.id,
            route: data.data.bestRoute,
            hospital: data.data.bestHospital
          };
        } catch (error) {
          console.error(`Failed to calculate route for vehicle ${vehicle.id}:`, error);
          return null;
        }
      });

      const routeResults = (await Promise.all(routePromises)).filter(Boolean);
      
      // Convert API response to our Route format
      const newRoutes: Route[] = routeResults.map((result, index) => {
        if (!result) return null;
        
        const route = result.route;
        const coordinates = route.features[0]?.geometry?.coordinates || [];
        const summary = route.features[0]?.properties?.summary || { duration: 0, distance: 0 };
        
        // Apply traffic simulation effects
        let duration = summary.duration;
        let distance = summary.distance;
        
        if (trafficSimulation) {
          // Simulate traffic congestion - increase duration by 50-100%
          const congestionFactor = 1.5 + Math.random() * 0.5; // 1.5x to 2x duration
          duration = duration * congestionFactor;
        }
        
        return {
          id: `route-${result.id}`,
          start: coordinates[0] || [0, 0],
          end: coordinates[coordinates.length - 1] || [0, 0],
          waypoints: coordinates.slice(1, -1),
          duration: Math.round(duration / 60), // Convert to minutes
          distance: Math.round(distance / 1000 * 10) / 10, // Convert to km
          isOptimized: trafficSimulation
        };
      }).filter(Boolean) as Route[];

      setRoutes(newRoutes);
    } catch (error) {
      console.error('Route calculation error:', error);
      setRouteError('Failed to calculate optimal routes');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Custom icons
  const hospitalIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const vehicleIcon = (status: string) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${status === 'available' ? 'green' : status === 'en-route' ? 'yellow' : 'red'}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const getRouteColor = (route: Route) => {
    if (trafficSimulation && route.isOptimized) {
      return '#10B981'; // Green for optimized routes
    } else if (trafficSimulation) {
      return '#EF4444'; // Red for congested routes
    }
    return '#3B82F6'; // Blue for normal routes
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[18.5204, 73.8567]}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapUpdater trafficSimulation={trafficSimulation} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hospitals */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={hospital.position}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-red-600">{hospital.name}</h3>
                <p className="text-sm text-gray-600">
                  Available Beds: {hospital.availableBeds}/{hospital.capacity}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Capacity: {Math.round((hospital.availableBeds / hospital.capacity) * 100)}%
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Emergency Vehicles */}
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={vehicle.position}
            icon={vehicleIcon(vehicle.status)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Emergency Vehicle {vehicle.id}</h3>
                <p className="text-sm capitalize">
                  Status: <span className={`font-semibold ${
                    vehicle.status === 'available' ? 'text-green-600' :
                    vehicle.status === 'en-route' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {vehicle.status.replace('-', ' ')}
                  </span>
                </p>
                {vehicle.destination && (
                  <p className="text-xs text-gray-500 mt-1">
                    En route to hospital
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Routes */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={[route.start, ...route.waypoints, route.end]}
            color={getRouteColor(route)}
            weight={4}
            opacity={0.8}
            eventHandlers={{
              click: () => setSelectedRoute(route)
            }}
          />
        ))}
      </MapContainer>

      {/* Route Info Panel */}
      {selectedRoute && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800">Route Details</h3>
            <button
              onClick={() => setSelectedRoute(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{selectedRoute.duration} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span className="font-semibold">{selectedRoute.distance} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${
                selectedRoute.isOptimized ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedRoute.isOptimized ? 'Optimized' : 'Congested'}
              </span>
            </div>
            {trafficSimulation && (
              <div className="mt-3 p-2 bg-blue-50 rounded text-blue-800 text-xs">
                AI has detected traffic congestion and optimized this route for faster response time.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isCalculatingRoute && (
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="font-semibold">Calculating optimal routes...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {routeError && (
        <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Error: {routeError}</span>
            <button
              onClick={calculateOptimalRoutes}
              className="ml-2 px-2 py-1 bg-red-700 rounded text-sm hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Traffic Simulation Status */}
      {trafficSimulation && (
        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">AI Traffic Simulation Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
