package handlers

import (
	"net/http"
	"time"

	"appdirect-workshop-backend/internal/models"
	"appdirect-workshop-backend/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AttendeeHandler struct {
	repo *repository.Repository
}

func NewAttendeeHandler(repo *repository.Repository) *AttendeeHandler {
	return &AttendeeHandler{repo: repo}
}

// GetAttendeeCount returns the total number of registered attendees
func (h *AttendeeHandler) GetAttendeeCount(c *gin.Context) {
	count, err := h.repo.GetAttendeeCount(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}

// RegisterAttendee creates a new attendee registration
func (h *AttendeeHandler) RegisterAttendee(c *gin.Context) {
	var attendee models.Attendee
	if err := c.ShouldBindJSON(&attendee); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	attendee.ID = uuid.New().String()
	attendee.RegisteredAt = time.Now()

	if err := h.repo.CreateAttendee(c.Request.Context(), &attendee); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, models.SuccessResponse{
		Message: "Registration successful",
		Data:    attendee,
	})
}

// GetAllAttendees returns all attendees (admin only)
func (h *AttendeeHandler) GetAllAttendees(c *gin.Context) {
	attendees, err := h.repo.GetAllAttendees(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, attendees)
}

// GetAttendee returns a specific attendee (admin only)
func (h *AttendeeHandler) GetAttendee(c *gin.Context) {
	id := c.Param("id")
	attendee, err := h.repo.GetAttendee(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Attendee not found"})
		return
	}

	c.JSON(http.StatusOK, attendee)
}

// DeleteAttendee deletes an attendee (admin only)
func (h *AttendeeHandler) DeleteAttendee(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteAttendee(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Attendee deleted successfully"})
}

