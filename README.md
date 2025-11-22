# AppDirect India AI Workshop - Event Registration SPA

A production-ready React Single Page Application (SPA) with Golang backend for event registration, featuring session management, speaker profiles, attendee registration, and an admin dashboard.

## Features

- **Hero Section** with animated CTAs
- **Sessions & Speakers** grid display
- **Registration Form** with live attendee count
- **Location Section** with embedded Google Maps
- **Admin Dashboard** with password protection:
  - Attendee management (view, delete)
  - Speaker CRUD operations
  - Session CRUD operations
  - Analytics pie chart (attendee breakdown by designation)

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Axios for API calls

### Backend
- Go 1.21+
- Gin web framework
- Firebase Admin SDK for Firestore
- CORS middleware

### Database
- Google Cloud Firestore
- Service account JSON for authentication

## Prerequisites

- Node.js 20+ and npm
- Go 1.21+
- Docker and Docker Compose (optional, for containerized deployment)
- Firebase project with Firestore enabled
- Firebase service account JSON file

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workshop
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod download
```

3. Create a `.env` file in the backend directory:
```bash
# Create .env file manually or copy from example
```

4. Create `.env` file with your Firebase credentials:
```env
FIRESTORE_PROJECT_ID=your-firebase-project-id
FIRESTORE_SUBCOLLECTION_ID=your-subcollection-id
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/service-account.json
ADMIN_PASSWORD=your-secure-admin-password
PORT=8080
CORS_ORIGIN=http://localhost:3000
GIN_MODE=debug
```

5. Place your Firebase service account JSON file in a secure location and update the path in `.env`.

**Note**: See `ENV_SETUP.md` for detailed environment variable documentation.

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_PASSWORD=your-secure-admin-password
```

**Important**: 
- Vite requires the `VITE_` prefix for environment variables
- The `VITE_ADMIN_PASSWORD` should match the backend `ADMIN_PASSWORD`
- See `ENV_SETUP.md` for detailed documentation

### 4. Running Locally

#### Option A: Run Separately

**Backend:**
```bash
cd backend
go run cmd/server/main.go
```

The backend will start on `http://localhost:8080`

**Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

#### Option B: Docker Compose

1. Ensure your `.env` file is configured in the root directory.

2. Update `docker-compose.yml` with the correct path to your service account JSON:
```yaml
volumes:
  - ${FIREBASE_SERVICE_ACCOUNT_PATH}:/app/service-account.json:ro
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

This will start both services:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

### 5. Building for Production

**Backend:**
```bash
cd backend
go build -o server ./cmd/server
```

**Frontend:**
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`.

## API Endpoints

### Public Endpoints

- `GET /api/sessions` - List all sessions with speakers
- `GET /api/speakers` - List all speakers
- `GET /api/attendees/count` - Get total attendee count
- `POST /api/attendees` - Register new attendee
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "designation": "Developer"
  }
  ```

### Admin Endpoints (Requires X-Admin-Password header)

- `GET /api/admin/attendees` - List all attendees
- `GET /api/admin/attendees/:id` - Get attendee details
- `DELETE /api/admin/attendees/:id` - Delete attendee
- `GET /api/admin/speakers` - List speakers
- `POST /api/admin/speakers` - Create speaker
- `PUT /api/admin/speakers/:id` - Update speaker
- `DELETE /api/admin/speakers/:id` - Delete speaker
- `GET /api/admin/sessions` - List sessions
- `POST /api/admin/sessions` - Create session
- `PUT /api/admin/sessions/:id` - Update session
- `DELETE /api/admin/sessions/:id` - Delete session
- `GET /api/admin/analytics/designation` - Get designation breakdown

## Firestore Structure

```
workshop-{SUBDOC_ID}/
├── attendees/
│   └── {attendeeId}/
│       ├── name: string
│       ├── email: string
│       ├── designation: string
│       └── registeredAt: timestamp
├── speakers/
│   └── {speakerId}/
│       ├── name: string
│       ├── bio: string
│       ├── photoUrl: string (optional)
│       └── sessions: []string (session IDs)
└── sessions/
    └── {sessionId}/
        ├── title: string
        ├── description: string
        ├── time: string
        ├── speakerIds: []string
        └── capacity: number (optional)
```

## Security Notes

- Never commit `.env` files or service account JSON files to version control
- Use strong passwords for admin access
- In production, use proper authentication mechanisms (JWT, OAuth, etc.)
- Ensure CORS is properly configured for your domain
- Keep Firebase service account credentials secure

## Designation Options

The registration form includes the following designation options:
- Developer
- Manager
- Designer
- Product Manager
- Other

## Development

### Backend Development

```bash
cd backend
go run cmd/server/main.go
```

### Frontend Development

```bash
cd frontend
npm run dev
```

## Troubleshooting

### Backend Issues

- Ensure Firebase service account JSON path is correct
- Verify Firestore project ID and subcollection ID
- Check that Firestore is enabled in your Firebase project

### Frontend Issues

- Ensure backend is running and accessible
- Check CORS configuration if API calls fail
- Verify environment variables are set correctly

### Docker Issues

- Ensure service account JSON path is correct in docker-compose.yml
- Check that all environment variables are set
- Verify Docker and Docker Compose are installed

## License

Copyright © 2024 AppDirect India. All rights reserved.

