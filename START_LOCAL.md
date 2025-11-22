# Running the Project Locally

## Quick Start Guide

### Prerequisites Check
- ✅ Node.js v22.11.0 installed
- ✅ npm 10.9.0 installed
- ✅ Docker 28.5.2 installed
- ❌ Go not installed (will use Docker for backend)

### Step 1: Configure Environment Variables

#### Backend Configuration (`backend/.env`)
Update `backend/.env` with your Firebase credentials:

```env
FIRESTORE_PROJECT_ID=your-actual-project-id
FIRESTORE_SUBCOLLECTION_ID=workshop-2024
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
ADMIN_PASSWORD=your-secure-password-123
PORT=8080
CORS_ORIGIN=http://localhost:3000
GIN_MODE=debug
```

**Important**: 
- Download your Firebase service account JSON file from Firebase Console
- Place it in the `backend/` directory
- Update `FIREBASE_SERVICE_ACCOUNT_PATH` accordingly

#### Frontend Configuration (`frontend/.env`)
Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=your-secure-password-123
```

**Important**: `VITE_ADMIN_PASSWORD` must match `ADMIN_PASSWORD` in backend!

### Step 2: Start Frontend (Already Started)

The frontend development server should already be running at:
- **URL**: http://localhost:3000

If not running, start it with:
```bash
cd frontend
npm run dev
```

### Step 3: Start Backend

Since Go is not installed, use Docker:

#### Option A: Docker Compose (Recommended)
```bash
# From root directory
docker-compose up backend
```

#### Option B: Docker Only (Backend)
```bash
# Build and run backend container
cd backend
docker build -t workshop-backend .
docker run -p 8080:8080 --env-file .env -v ${PWD}/service-account.json:/app/service-account.json:ro workshop-backend
```

#### Option C: Install Go and Run Locally
1. Install Go from https://go.dev/dl/
2. Run:
```bash
cd backend
go mod download
go run cmd/server/main.go
```

### Step 4: Verify Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/health

### Troubleshooting

#### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check `VITE_API_URL` in `frontend/.env`
- Verify CORS settings in backend

#### Backend errors
- Check Firebase credentials in `backend/.env`
- Ensure service account JSON file exists and path is correct
- Verify Firestore is enabled in your Firebase project

#### Docker issues
- Ensure Docker Desktop is running
- Check that ports 3000 and 8080 are not in use
- Verify environment variables are set correctly

### Development Commands

**Frontend:**
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Backend (if Go is installed):**
```bash
cd backend
go run cmd/server/main.go    # Run server
go mod tidy                  # Clean dependencies
```

**Docker:**
```bash
docker-compose up            # Start all services
docker-compose up -d         # Start in background
docker-compose down          # Stop all services
docker-compose logs          # View logs
```

### Next Steps

1. ✅ Frontend is running
2. ⏳ Configure `backend/.env` with Firebase credentials
3. ⏳ Start backend server (Docker or Go)
4. ⏳ Test the application at http://localhost:3000

