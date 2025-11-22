package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// AdminAuth middleware validates admin password
func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		password := c.GetHeader("X-Admin-Password")
		expectedPassword := os.Getenv("ADMIN_PASSWORD")

		if expectedPassword == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Admin password not configured"})
			c.Abort()
			return
		}

		if password != expectedPassword {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin password"})
			c.Abort()
			return
		}

		c.Next()
	}
}

