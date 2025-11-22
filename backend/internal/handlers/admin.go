package handlers

import (
	"net/http"

	"appdirect-workshop-backend/internal/models"
	"appdirect-workshop-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	repo *repository.Repository
}

func NewAdminHandler(repo *repository.Repository) *AdminHandler {
	return &AdminHandler{repo: repo}
}

// GetDesignationBreakdown returns analytics breakdown by designation
func (h *AdminHandler) GetDesignationBreakdown(c *gin.Context) {
	breakdown, err := h.repo.GetDesignationBreakdown(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, breakdown)
}

