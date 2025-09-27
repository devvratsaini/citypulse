import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Enable collection of default metrics (CPU, memory, etc.)
collectDefaultMetrics();

// Custom metrics for CityPulse application
export const metrics = {
  // User authentication metrics
  userRegistrations: new Counter({
    name: 'citypulse_user_registrations_total',
    help: 'Total number of user registrations',
    labelNames: ['status'] // success, failure
  }),

  userSignins: new Counter({
    name: 'citypulse_user_signins_total',
    help: 'Total number of user sign-ins',
    labelNames: ['status'] // success, failure
  }),

  // Emergency response metrics
  routeCalculations: new Counter({
    name: 'citypulse_route_calculations_total',
    help: 'Total number of route calculations',
    labelNames: ['status', 'traffic_conditions'] // success, failure; normal, congested
  }),

  routeCalculationDuration: new Histogram({
    name: 'citypulse_route_calculation_duration_seconds',
    help: 'Duration of route calculations in seconds',
    labelNames: ['traffic_conditions'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
  }),

  emergencyVehiclesActive: new Gauge({
    name: 'citypulse_emergency_vehicles_active',
    help: 'Number of active emergency vehicles',
    labelNames: ['status'] // available, en_route, busy
  }),

  hospitalsCapacity: new Gauge({
    name: 'citypulse_hospitals_capacity_ratio',
    help: 'Hospital capacity utilization ratio (0-1)',
    labelNames: ['hospital_id', 'hospital_name']
  }),

  // AI traffic simulation metrics
  trafficSimulations: new Counter({
    name: 'citypulse_traffic_simulations_total',
    help: 'Total number of traffic simulations',
    labelNames: ['congestion_level'] // low, medium, high
  }),

  routeOptimizations: new Counter({
    name: 'citypulse_route_optimizations_total',
    help: 'Total number of route optimizations performed',
    labelNames: ['optimization_type'] // traffic_avoidance, priority_based, ai_optimized
  }),

  // API performance metrics
  apiRequests: new Counter({
    name: 'citypulse_api_requests_total',
    help: 'Total number of API requests',
    labelNames: ['method', 'endpoint', 'status_code']
  }),

  apiRequestDuration: new Histogram({
    name: 'citypulse_api_request_duration_seconds',
    help: 'Duration of API requests in seconds',
    labelNames: ['method', 'endpoint'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
  }),

  // System health metrics
  activeConnections: new Gauge({
    name: 'citypulse_active_connections',
    help: 'Number of active database connections'
  }),

  memoryUsage: new Gauge({
    name: 'citypulse_memory_usage_bytes',
    help: 'Memory usage in bytes',
    labelNames: ['type'] // heap_used, heap_total, external
  })
};

// Helper functions for common metric operations
export const recordApiRequest = (method: string, endpoint: string, statusCode: number, duration: number) => {
  metrics.apiRequests.inc({ method, endpoint, status_code: statusCode.toString() });
  metrics.apiRequestDuration.observe({ method, endpoint }, duration);
};

export const recordUserAction = (action: 'registration' | 'signin', status: 'success' | 'failure') => {
  if (action === 'registration') {
    metrics.userRegistrations.inc({ status });
  } else {
    metrics.userSignins.inc({ status });
  }
};

export const recordRouteCalculation = (status: 'success' | 'failure', trafficConditions: 'normal' | 'congested', duration: number) => {
  metrics.routeCalculations.inc({ status, traffic_conditions: trafficConditions });
  metrics.routeCalculationDuration.observe({ traffic_conditions: trafficConditions }, duration);
};

export const recordTrafficSimulation = (congestionLevel: 'low' | 'medium' | 'high') => {
  metrics.trafficSimulations.inc({ congestion_level: congestionLevel });
};

export const updateVehicleStatus = (status: 'available' | 'en_route' | 'busy', count: number) => {
  metrics.emergencyVehiclesActive.set({ status }, count);
};

export const updateHospitalCapacity = (hospitalId: string, hospitalName: string, capacityRatio: number) => {
  metrics.hospitalsCapacity.set({ hospital_id: hospitalId, hospital_name: hospitalName }, capacityRatio);
};

export const updateMemoryUsage = () => {
  const memUsage = process.memoryUsage();
  metrics.memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed);
  metrics.memoryUsage.set({ type: 'heap_total' }, memUsage.heapTotal);
  metrics.memoryUsage.set({ type: 'external' }, memUsage.external);
};

// Update memory usage every 30 seconds
setInterval(updateMemoryUsage, 30000);

export default register;
