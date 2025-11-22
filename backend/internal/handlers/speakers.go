package handlers

import (
	"net/http"

	"appdirect-workshop-backend/internal/models"
	"appdirect-workshop-backend/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SpeakerHandler struct {
	repo *repository.Repository
}

func NewSpeakerHandler(repo *repository.Repository) *SpeakerHandler {
	return &SpeakerHandler{repo: repo}
}

// GetAllSpeakers returns all speakers
func (h *SpeakerHandler) GetAllSpeakers(c *gin.Context) {
	speakers, err := h.repo.GetAllSpeakers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, speakers)
}

// GetSpeaker returns a specific speaker
func (h *SpeakerHandler) GetSpeaker(c *gin.Context) {
	id := c.Param("id")
	speaker, err := h.repo.GetSpeaker(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Speaker not found"})
		return
	}

	c.JSON(http.StatusOK, speaker)
}

// CreateSpeaker creates a new speaker (admin only)
func (h *SpeakerHandler) CreateSpeaker(c *gin.Context) {
	var speaker models.Speaker
	if err := c.ShouldBindJSON(&speaker); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	speaker.ID = uuid.New().String()

	if err := h.repo.CreateSpeaker(c.Request.Context(), &speaker); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, models.SuccessResponse{
		Message: "Speaker created successfully",
		Data:    speaker,
	})
}

// UpdateSpeaker updates an existing speaker (admin only)
func (h *SpeakerHandler) UpdateSpeaker(c *gin.Context) {
	id := c.Param("id")
	var speaker models.Speaker
	if err := c.ShouldBindJSON(&speaker); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if err := h.repo.UpdateSpeaker(c.Request.Context(), id, &speaker); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	speaker.ID = id
	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Speaker updated successfully",
		Data:    speaker,
	})
}

// DeleteSpeaker deletes a speaker (admin only)
func (h *SpeakerHandler) DeleteSpeaker(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteSpeaker(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Speaker deleted successfully"})
}

