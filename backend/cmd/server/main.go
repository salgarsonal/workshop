package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"appdirect-workshop-backend/internal/handlers"
	"appdirect-workshop-backend/internal/middleware"
	"appdirect-workshop-backend/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file in backend directory or root
	if err := godotenv.Load(); err != nil {
		// Try loading from backend directory
		if err2 := godotenv.Load("./backend/.env"); err2 != nil {
			// Try loading from root
			if err3 := godotenv.Load("../.env"); err3 != nil {
				log.Println("No .env file found, using environment variables")
			}
		}
	}

	// Get configuration from environment
	projectID := os.Getenv("FIRESTORE_PROJECT_ID")
	subDocID := os.Getenv("FIRESTORE_SUBCOLLECTION_ID")
	serviceAccountPath := os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
	port := os.Getenv("PORT")
	corsOrigin := os.Getenv("CORS_ORIGIN")

	if port == "" {
		port = "8080"
	}
	if corsOrigin == "" {
		corsOrigin = "http://localhost:3000"
	}

	// Validate required environment variables
	if projectID == "" || subDocID == "" {
		log.Fatal("FIRESTORE_PROJECT_ID and FIRESTORE_SUBCOLLECTION_ID are required")
	}

	// Initialize Firestore repository
	ctx := context.Background()
	repo, err := repository.NewRepository(ctx, projectID, subDocID, serviceAccountPath)
	if err != nil {
		log.Fatalf("Failed to initialize repository: %v", err)
	}
	defer repo.Close()

	// Initialize handlers
	attendeeHandler := handlers.NewAttendeeHandler(repo)
	speakerHandler := handlers.NewSpeakerHandler(repo)
	sessionHandler := handlers.NewSessionHandler(repo)
	adminHandler := handlers.NewAdminHandler(repo)

	// Setup Gin router
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{corsOrigin}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Admin-Password"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Public API routes
	api := router.Group("/api")
	{
		// Sessions
		api.GET("/sessions", sessionHandler.GetAllSessions)
		api.GET("/sessions/:id", sessionHandler.GetSession)

		// Speakers
		api.GET("/speakers", speakerHandler.GetAllSpeakers)
		api.GET("/speakers/:id", speakerHandler.GetSpeaker)

		// Attendees
		api.GET("/attendees/count", attendeeHandler.GetAttendeeCount)
		api.POST("/attendees", attendeeHandler.RegisterAttendee)
	}

	// Admin API routes (password protected)
	admin := router.Group("/api/admin")
	admin.Use(middleware.AdminAuth())
	{
		// Attendees
		admin.GET("/attendees", attendeeHandler.GetAllAttendees)
		admin.GET("/attendees/:id", attendeeHandler.GetAttendee)
		admin.DELETE("/attendees/:id", attendeeHandler.DeleteAttendee)

		// Speakers
		admin.GET("/speakers", speakerHandler.GetAllSpeakers)
		admin.POST("/speakers", speakerHandler.CreateSpeaker)
		admin.PUT("/speakers/:id", speakerHandler.UpdateSpeaker)
		admin.DELETE("/speakers/:id", speakerHandler.DeleteSpeaker)

		// Sessions
		admin.GET("/sessions", sessionHandler.GetAllSessions)
		admin.POST("/sessions", sessionHandler.CreateSession)
		admin.PUT("/sessions/:id", sessionHandler.UpdateSession)
		admin.DELETE("/sessions/:id", sessionHandler.DeleteSession)

		// Analytics
		admin.GET("/analytics/designation", adminHandler.GetDesignationBreakdown)
	}

	// Start server
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("Server started on port %s", port)

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}

