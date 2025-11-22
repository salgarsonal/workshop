# Environment Variables Setup Guide

This document explains how to configure environment variables for both frontend and backend.

## Backend Environment Variables

Create a `.env` file in the `backend/` directory or in the root directory with the following variables:

```env
# Firebase Configuration (Required)
FIRESTORE_PROJECT_ID=your-firebase-project-id
FIRESTORE_SUBCOLLECTION_ID=your-subcollection-id
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/service-account.json

# Server Configuration (Optional - defaults provided)
PORT=8080
CORS_ORIGIN=http://localhost:3000
GIN_MODE=debug

# Security (Required)
ADMIN_PASSWORD=your-secure-admin-password
```

### Backend Environment Variables Explained

- **FIRESTORE_PROJECT_ID**: Your Firebase project ID (required)
- **FIRESTORE_SUBCOLLECTION_ID**: Identifier for the Firestore subcollection (required)
- **FIREBASE_SERVICE_ACCOUNT_PATH**: Path to your Firebase service account JSON file (required)
- **PORT**: Server port (default: 8080)
- **CORS_ORIGIN**: Allowed CORS origin for frontend (default: http://localhost:3000)
- **GIN_MODE**: Gin framework mode - "debug" or "release" (default: debug)
- **ADMIN_PASSWORD**: Password for admin panel access (required)

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080/api

# Admin password for frontend validation
VITE_ADMIN_PASSWORD=your-secure-admin-password
```

**Note**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.

### Frontend Environment Variables Explained

- **VITE_API_URL**: Backend API base URL (default: http://localhost:8080/api)
- **VITE_ADMIN_PASSWORD**: Admin password for frontend login validation (should match backend ADMIN_PASSWORD)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` and fill in your Firebase credentials:
```env
FIRESTORE_PROJECT_ID=my-project-id
FIRESTORE_SUBCOLLECTION_ID=workshop-2024
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
ADMIN_PASSWORD=my-secure-password-123
```

4. Place your Firebase service account JSON file in the backend directory or update the path accordingly.

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env` and configure:
```env
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=my-secure-password-123
```

**Important**: The `VITE_ADMIN_PASSWORD` should match the backend `ADMIN_PASSWORD`.

### 3. Docker Setup

For Docker Compose, create a `.env` file in the root directory:

```env
# Backend
FIRESTORE_PROJECT_ID=your-firebase-project-id
FIRESTORE_SUBCOLLECTION_ID=your-subcollection-id
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/service-account.json
ADMIN_PASSWORD=your-secure-admin-password

# Frontend
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=your-secure-admin-password
```

## Environment Variable Loading

### Backend
The backend will try to load `.env` files in this order:
1. Current directory (where the binary is run)
2. `./backend/.env`
3. `../.env` (parent directory)

If no `.env` file is found, it will use system environment variables.

### Frontend
Vite automatically loads `.env` files from the `frontend/` directory. Environment variables with the `VITE_` prefix are exposed to the client code.

## Security Notes

1. **Never commit `.env` files** to version control
2. **Never commit service account JSON files** to version control
3. Use strong, unique passwords for `ADMIN_PASSWORD`
4. In production, use proper secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
5. The `VITE_ADMIN_PASSWORD` is exposed in the client bundle - this is for basic protection only. For production, implement proper authentication.

## Troubleshooting

### Backend can't find environment variables
- Ensure `.env` file exists in the correct location
- Check that variable names match exactly (case-sensitive)
- Verify no extra spaces around `=` sign
- Check file encoding (should be UTF-8)

### Frontend can't access environment variables
- Ensure variables start with `VITE_` prefix
- Restart the Vite dev server after changing `.env` file
- Check that `.env` file is in the `frontend/` directory
- Verify variable names match exactly

### Docker environment variables not working
- Ensure `.env` file is in the root directory (same as docker-compose.yml)
- Check that variable names in docker-compose.yml match your `.env` file
- Rebuild containers after changing environment variables: `docker-compose up --build`

## Example .env Files

### Root .env (for Docker)
```env
FIRESTORE_PROJECT_ID=my-workshop-project
FIRESTORE_SUBCOLLECTION_ID=workshop-2024
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/service-account.json
ADMIN_PASSWORD=SecurePassword123!
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=SecurePassword123!
```

### Backend .env
```env
FIRESTORE_PROJECT_ID=my-workshop-project
FIRESTORE_SUBCOLLECTION_ID=workshop-2024
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
ADMIN_PASSWORD=SecurePassword123!
PORT=8080
CORS_ORIGIN=http://localhost:3000
GIN_MODE=debug
```

### Frontend .env
```env
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=SecurePassword123!
```

