"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaAmbulance, FaHospital, FaRoute, FaClock, FaTrafficLight } from 'react-icons/fa';
import Chatbot from '@/components/Chatbot';

// Dynamically import the map component to avoid SSR issues
const EmergencyMap = dynamic(() => import('@/components/EmergencyMap'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading map...</div>
});

interface User {
  id: string;
  email: string;
  fullName: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trafficSimulation, setTrafficSimulation] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isAddingHospital, setIsAddingHospital] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'info' | 'warning'}>>([]);
  const [emergencyStats, setEmergencyStats] = useState({
    activeRoutes: 3,
    averageResponseTime: '4.2',
    hospitalsCovered: 12,
    vehiclesDeployed: 8
  });

  console.log('Dashboard chatbot state:', isChatbotOpen);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/signin');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      router.push('/signin');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleTrafficSimulation = () => {
    setTrafficSimulation(!trafficSimulation);
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleDeployVehicle = async () => {
    setIsDeploying(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate deploying a new emergency vehicle
    const newVehicleId = `ambulance-${Date.now()}`;
    const randomPosition: [number, number] = [
      18.5204 + (Math.random() - 0.5) * 0.1, // Random position around Pune
      73.8567 + (Math.random() - 0.5) * 0.1
    ];
    
    // Show success notification
    addNotification(`🚑 Emergency vehicle ${newVehicleId} deployed successfully! Location: ${randomPosition[0].toFixed(4)}, ${randomPosition[1].toFixed(4)}`);
    
    // Update stats
    setEmergencyStats(prev => ({
      ...prev,
      vehiclesDeployed: prev.vehiclesDeployed + 1
    }));
    
    console.log('Deployed new vehicle:', { id: newVehicleId, position: randomPosition });
    setIsDeploying(false);
  };

  const handleAddHospital = async () => {
    setIsAddingHospital(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate adding a new hospital
    const hospitalNames = [
      'Pune Medical Center',
      'Emergency Care Hospital',
      'City Trauma Center',
      'Pune Emergency Services',
      'Rapid Response Medical',
      'Pune City Hospital',
      'Emergency Response Center',
      'Pune Trauma Care'
    ];
    
    const randomName = hospitalNames[Math.floor(Math.random() * hospitalNames.length)];
    const randomPosition: [number, number] = [
      18.5204 + (Math.random() - 0.5) * 0.2, // Random position around Pune
      73.8567 + (Math.random() - 0.5) * 0.2
    ];
    
    const capacity = Math.floor(Math.random() * 100) + 50; // 50-150 capacity
    const availableBeds = Math.floor(Math.random() * capacity);
    
    // Show success notification
    addNotification(`🏥 New hospital "${randomName}" added successfully! Capacity: ${capacity} beds, Available: ${availableBeds} beds`);
    
    // Update stats
    setEmergencyStats(prev => ({
      ...prev,
      hospitalsCovered: prev.hospitalsCovered + 1
    }));
    
    console.log('Added new hospital:', { 
      name: randomName, 
      position: randomPosition, 
      capacity, 
      availableBeds 
    });
    
    setIsAddingHospital(false);
  };

  const handleCalculateRoute = async () => {
    setIsCalculating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simulate calculating a new emergency route
    const startPosition: [number, number] = [
      18.5204 + (Math.random() - 0.5) * 0.1,
      73.8567 + (Math.random() - 0.5) * 0.1
    ];
    
    const endPosition: [number, number] = [
      18.5204 + (Math.random() - 0.5) * 0.1,
      73.8567 + (Math.random() - 0.5) * 0.1
    ];
    
    const distance = Math.sqrt(
      Math.pow(endPosition[0] - startPosition[0], 2) + 
      Math.pow(endPosition[1] - startPosition[1], 2)
    ) * 111; // Rough conversion to km
    
    const baseDuration = Math.floor(distance * 2 + Math.random() * 5); // 2-7 minutes per km
    const duration = trafficSimulation ? Math.floor(baseDuration * 1.5) : baseDuration; // Add traffic delay
    
    // Show route calculation notification
    addNotification(`🛣️ New emergency route calculated! Distance: ${distance.toFixed(2)} km, Time: ${duration} min, Traffic: ${trafficSimulation ? 'Congested (AI Optimized)' : 'Normal'}`);
    
    // Update stats
    setEmergencyStats(prev => ({
      ...prev,
      activeRoutes: prev.activeRoutes + 1
    }));
    
    console.log('Calculated new route:', { 
      start: startPosition, 
      end: endPosition, 
      distance, 
      duration,
      trafficSimulation 
    });
    
    setIsCalculating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-400">CityPulse</h1>
            <span className="text-sm text-gray-400">Emergency Response Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Welcome, {user?.fullName}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Emergency Stats */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-blue-400">Emergency Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaRoute className="text-green-400" />
                    <span className="text-sm text-gray-300">Active Routes</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{emergencyStats.activeRoutes}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-blue-400" />
                    <span className="text-sm text-gray-300">Avg Response</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{emergencyStats.averageResponseTime}m</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaHospital className="text-red-400" />
                    <span className="text-sm text-gray-300">Hospitals</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{emergencyStats.hospitalsCovered}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FaAmbulance className="text-yellow-400" />
                    <span className="text-sm text-gray-300">Vehicles</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{emergencyStats.vehiclesDeployed}</div>
                </div>
              </div>
            </div>

            {/* AI Controls */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-blue-400">AI Controls</h2>
              <div className="space-y-4">
                <button
                  onClick={toggleTrafficSimulation}
                  className={`w-full p-4 rounded-lg font-semibold transition-colors ${
                    trafficSimulation
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <FaTrafficLight className="text-lg" />
                    <span>{trafficSimulation ? 'Stop Traffic Simulation' : 'Simulate Traffic Jam'}</span>
                  </div>
                </button>
                <div className="text-sm text-gray-400">
                  {trafficSimulation 
                    ? 'AI is simulating traffic congestion and optimizing routes in real-time.'
                    : 'Click to simulate traffic conditions and test dynamic re-routing.'
                  }
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-blue-400">Quick Actions</h2>
              <div className="space-y-2">
                <button 
                  onClick={handleDeployVehicle}
                  disabled={isDeploying}
                  className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-2">
                    {isDeploying ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaAmbulance />
                    )}
                    <span>{isDeploying ? 'Deploying Vehicle...' : 'Deploy Emergency Vehicle'}</span>
                  </div>
                </button>
                <button 
                  onClick={handleAddHospital}
                  disabled={isAddingHospital}
                  className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-2">
                    {isAddingHospital ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaHospital />
                    )}
                    <span>{isAddingHospital ? 'Adding Hospital...' : 'Add Hospital Location'}</span>
                  </div>
                </button>
                <button 
                  onClick={handleCalculateRoute}
                  disabled={isCalculating}
                  className="w-full p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-2">
                    {isCalculating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaRoute />
                    )}
                    <span>{isCalculating ? 'Calculating Route...' : 'Calculate New Route'}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <EmergencyMap trafficSimulation={trafficSimulation} />
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : notification.type === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  );
}
