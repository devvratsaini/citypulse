// MongoDB initialization script for CityPulse
db = db.getSiblingDB('citypulse');

// Create collections
db.createCollection('users');
db.createCollection('emergency_routes');
db.createCollection('hospitals');
db.createCollection('vehicles');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

db.emergency_routes.createIndex({ "vehicleId": 1 });
db.emergency_routes.createIndex({ "hospitalId": 1 });
db.emergency_routes.createIndex({ "createdAt": 1 });

db.hospitals.createIndex({ "position": "2dsphere" });
db.hospitals.createIndex({ "name": 1 });

db.vehicles.createIndex({ "position": "2dsphere" });
db.vehicles.createIndex({ "status": 1 });

// Insert sample hospitals
db.hospitals.insertMany([
  {
    name: "City General Hospital",
    position: { type: "Point", coordinates: [-73.9851, 40.7589] },
    capacity: 200,
    availableBeds: 45,
    specialties: ["Emergency", "Cardiology", "Trauma"],
    address: "123 Medical Center Dr, New York, NY 10001",
    phone: "+1-555-0123",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Metro Medical Center",
    position: { type: "Point", coordinates: [-73.9934, 40.7505] },
    capacity: 150,
    availableBeds: 23,
    specialties: ["Emergency", "Neurology", "Pediatrics"],
    address: "456 Health Ave, New York, NY 10002",
    phone: "+1-555-0456",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Emergency Care Unit",
    position: { type: "Point", coordinates: [-73.9776, 40.7614] },
    capacity: 100,
    availableBeds: 67,
    specialties: ["Emergency", "Critical Care"],
    address: "789 Urgent St, New York, NY 10003",
    phone: "+1-555-0789",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample emergency vehicles
db.vehicles.insertMany([
  {
    id: "ambulance-001",
    type: "ambulance",
    position: { type: "Point", coordinates: [-74.0060, 40.7128] },
    status: "available",
    capacity: 2,
    equipment: ["defibrillator", "oxygen", "stretcher"],
    driver: "John Smith",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "ambulance-002",
    type: "ambulance",
    position: { type: "Point", coordinates: [-73.9942, 40.7282] },
    status: "en-route",
    capacity: 2,
    equipment: ["defibrillator", "oxygen", "stretcher"],
    driver: "Jane Doe",
    destination: { type: "Point", coordinates: [-73.9851, 40.7589] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fire-rescue-001",
    type: "fire_rescue",
    position: { type: "Point", coordinates: [-73.9934, 40.7505] },
    status: "busy",
    capacity: 4,
    equipment: ["jaws_of_life", "fire_extinguisher", "medical_kit"],
    driver: "Mike Johnson",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("CityPulse database initialized successfully!");
print("Created collections: users, emergency_routes, hospitals, vehicles");
print("Inserted sample data for hospitals and vehicles");
