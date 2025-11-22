package handlers

import (
	"net/http"

	"appdirect-workshop-backend/internal/models"
	"appdirect-workshop-backend/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SessionHandler struct {
	repo *repository.Repository
}

func NewSessionHandler(repo *repository.Repository) *SessionHandler {
	return &SessionHandler{repo: repo}
}

// GetAllSessions returns all sessions with speaker details
func (h *SessionHandler) GetAllSessions(c *gin.Context) {
	sessions, err := h.repo.GetSessionsWithSpeakers(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, sessions)
}

// GetSession returns a specific session
func (h *SessionHandler) GetSession(c *gin.Context) {
	id := c.Param("id")
	session, err := h.repo.GetSession(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Session not found"})
		return
	}

	c.JSON(http.StatusOK, session)
}

// CreateSession creates a new session (admin only)
func (h *SessionHandler) CreateSession(c *gin.Context) {
	var session models.Session
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	session.ID = uuid.New().String()

	if err := h.repo.CreateSession(c.Request.Context(), &session); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, models.SuccessResponse{
		Message: "Session created successfully",
		Data:    session,
	})
}

// UpdateSession updates an existing session (admin only)
func (h *SessionHandler) UpdateSession(c *gin.Context) {
	id := c.Param("id")
	var session models.Session
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	if err := h.repo.UpdateSession(c.Request.Context(), id, &session); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	session.ID = id
	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Session updated successfully",
		Data:    session,
	})
}

// DeleteSession deletes a session (admin only)
func (h *SessionHandler) DeleteSession(c *gin.Context) {
	id := c.Param("id")
	if err := h.repo.DeleteSession(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Session deleted successfully"})
}

