# CityPulse - AI-Powered Emergency Response Platform

![CityPulse Logo](https://img.shields.io/badge/CityPulse-Emergency%20Response-blue?style=for-the-badge&logo=ambulance)

A secure, scalable, and observable geospatial-AI platform designed to address critical urban challenges through AI-powered emergency response optimization. CityPulse integrates a full DevSecOps lifecycle from code commit to real-time monitoring.

## 🚑 Core Features

### Lifeline - AI-Powered Emergency Response Optimizer
- **Real-time Dashboard**: Interactive map showing fastest routes for emergency vehicles to hospitals
- **AI Integration**: Dynamic re-routing based on AI-predicted traffic congestion using LSTM models
- **Interactive Map**: Leaflet/OpenStreetMap integration with clear route visualization
- **ETA Display**: Estimated arrival times and status monitoring
- **Traffic Simulation**: "Simulate Traffic Jam" button for demonstrating dynamic re-routing
- **AI Chatbot**: Intelligent assistant for emergency response queries and system information

### Security & Authentication
- **Secure User Management**: Sign-up/Sign-in with bcrypt password hashing
- **JWT Authentication**: Secure token-based authentication
- **Security Scanning**: Integrated SAST, SCA, and secret detection

### Monitoring & Observability
- **Prometheus Metrics**: Custom application metrics collection
- **Grafana Dashboards**: Real-time visualization and alerting
- **Health Checks**: Container health monitoring
- **Performance Tracking**: API response times and system metrics

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React-Leaflet** - Interactive maps
- **OpenRouteService API** - Routing and geocoding

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Document database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### AI & Analytics
- **Python Microservice** - LSTM/GNN models for traffic prediction
- **Prometheus** - Metrics collection and storage
- **Grafana** - Metrics visualization and alerting

### DevOps & Security
- **Docker** - Containerization with multi-stage builds
- **GitHub Actions** - CI/CD pipeline
- **ESLint Security Plugin** - Static Application Security Testing
- **Gitleaks** - Secret detection
- **Trivy** - Container vulnerability scanning

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/citypulse.git
   cd citypulse
   ```

2. **Install dependencies and set up environment**
   ```bash
   npm run setup
   ```
   
   This will:
   - Install all dependencies
   - Create `.env.local` with default values
   - Check MongoDB status
   - Provide instructions for API key setup

3. **Configure API keys (optional)**
   
   For real routing functionality, get a free API key from [OpenRouteService](https://openrouteservice.org/dev/#/signup) and update `.env.local`:
   ```env
   ORS_API_KEY=your-actual-api-key-here
   ```
   
   **Note**: The app works without the API key using mock routing for demonstration purposes.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
   
6. **Try the AI Chatbot**
   Click the robot icon in the bottom-right corner to interact with the AI assistant for emergency response information.

### Docker Deployment

1. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - CityPulse App: [http://localhost:3000](http://localhost:3000)
   - Grafana: [http://localhost:3001](http://localhost:3001) (admin/admin123)
   - Prometheus: [http://localhost:9090](http://localhost:9090)

## 📊 Monitoring & Metrics

### Available Endpoints
- **Health Check**: `/api/health` - Application health status
- **Metrics**: `/api/metrics` - Prometheus metrics in OpenMetrics format

### Key Metrics Tracked
- User registrations and sign-ins
- Route calculation requests and duration
- Emergency vehicle status and capacity
- Hospital capacity utilization
- API request performance
- System resource usage

### Grafana Dashboards
Pre-configured dashboards for:
- Application performance metrics
- Emergency response statistics
- System health monitoring
- Traffic simulation analytics

## 🔒 Security Features

### Code Security
- **ESLint Security Plugin**: Detects security vulnerabilities in code
- **Gitleaks**: Pre-commit hook for secret scanning
- **npm audit**: Dependency vulnerability scanning
- **GitHub Dependabot**: Automated dependency updates

### Container Security
- **Multi-stage Docker builds**: Minimal attack surface
- **Non-root user**: Security-hardened containers
- **Trivy scanning**: Container vulnerability detection
- **Health checks**: Container orchestration support

### API Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Request validation and sanitization
- **Rate Limiting**: API request throttling (configurable)

## 🏗 Architecture

### Project Structure
```
citypulse/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Main dashboard
│   │   └── signin/         # Authentication pages
│   ├── components/         # React components
│   ├── lib/               # Utilities and services
│   └── models/            # Database models
├── .github/workflows/     # GitHub Actions CI/CD
├── docker-compose.yml     # Local development setup
├── Dockerfile            # Container configuration
└── prometheus.yml        # Monitoring configuration
```

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User authentication
- `POST /api/emergency/route` - Emergency route calculation
- `POST /api/ai/traffic-simulation` - AI traffic simulation
- `GET /api/metrics` - Prometheus metrics
- `GET /api/health` - Health check

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Security audit
npm audit
```

### Pre-commit Hooks
Automated checks on every commit:
- ESLint security scanning
- TypeScript type checking
- Secret detection with Gitleaks
- Dependency vulnerability scanning

## 🚀 Deployment

### GitHub Actions CI/CD
Automated pipeline includes:
1. **Security Scanning**: SAST, SCA, secret detection
2. **Code Quality**: Linting, type checking, formatting
3. **Build & Test**: Application build and test execution
4. **Docker Build**: Multi-architecture container builds
5. **Security Scan**: Trivy vulnerability scanning
6. **Deployment**: Staging and production deployments

### Environment Variables
Required environment variables for production:
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
ORS_API_KEY=your-openroute-service-api-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Ensure security compliance
- Follow the established code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [OpenRouteService](https://openrouteservice.org/) - Routing API
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Prometheus](https://prometheus.io/) - Monitoring
- [Grafana](https://grafana.com/) - Visualization

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**CityPulse** - Saving lives through AI-powered emergency response optimization 🚑✨
