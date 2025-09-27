#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CityPulse environment...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy env.example to .env.local
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local from env.example');
  } else {
    // Create a basic .env.local
    const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/citypulse

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# OpenRouteService API Key for routing
# Get your free API key from: https://openrouteservice.org/dev/#/signup
ORS_API_KEY=your-openroute-service-api-key-here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local with default values');
  }
} else {
  console.log('✅ .env.local already exists');
}

console.log('\n📝 Environment setup complete!');
console.log('\n🔑 To enable real routing, get a free API key from:');
console.log('   https://openrouteservice.org/dev/#/signup');
console.log('\n📖 Then update ORS_API_KEY in .env.local');
console.log('\n🚀 Run "npm run dev" to start the development server');

// Check if MongoDB is running
const { exec } = require('child_process');
exec('mongosh --eval "db.runCommand({ping: 1})" --quiet', (error, stdout, stderr) => {
  if (error) {
    console.log('\n⚠️  MongoDB not detected. Make sure MongoDB is running:');
    console.log('   - Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('   - Or use Docker: docker run -d -p 27017:27017 mongo:7.0');
  } else {
    console.log('\n✅ MongoDB is running');
  }
});
