# Environment Variables Configuration

## Quick Start

### Backend (.env in backend/ directory)
```env
FIRESTORE_PROJECT_ID=your-firebase-project-id
FIRESTORE_SUBCOLLECTION_ID=your-subcollection-id
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
ADMIN_PASSWORD=your-secure-password
PORT=8080
CORS_ORIGIN=http://localhost:3000
GIN_MODE=debug
```

### Frontend (.env in frontend/ directory)
```env
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=your-secure-password
```

**Note**: `VITE_ADMIN_PASSWORD` must match `ADMIN_PASSWORD` from backend.

## Files Created/Updated

1. **frontend/src/vite-env.d.ts** - TypeScript definitions for Vite environment variables
2. **backend/cmd/server/main.go** - Fixed missing `net/http` import and improved .env loading
3. **frontend/Dockerfile** - Added build args for environment variables
4. **docker-compose.yml** - Updated to pass environment variables to frontend build
5. **ENV_SETUP.md** - Comprehensive environment variable documentation

## All Errors Fixed

✅ Missing `net/http` import in backend main.go
✅ TypeScript environment variable types added
✅ Docker build configuration for environment variables
✅ Environment variable loading improved (multiple fallback paths)

See `ENV_SETUP.md` for detailed documentation.

