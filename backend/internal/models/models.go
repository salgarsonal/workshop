package models

import "time"

// Attendee represents an event attendee
type Attendee struct {
	ID          string    `json:"id"`
	Name        string    `json:"name" binding:"required"`
	Email       string    `json:"email" binding:"required,email"`
	Designation string    `json:"designation" binding:"required"`
	RegisteredAt time.Time `json:"registeredAt"`
}

// Speaker represents an event speaker
type Speaker struct {
	ID       string   `json:"id"`
	Name     string   `json:"name" binding:"required"`
	Bio      string   `json:"bio" binding:"required"`
	PhotoURL string   `json:"photoUrl,omitempty"`
	Sessions []string `json:"sessions,omitempty"`
}

// Session represents an event session
type Session struct {
	ID          string   `json:"id"`
	Title       string   `json:"title" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Time        string   `json:"time" binding:"required"`
	SpeakerIDs  []string `json:"speakerIds" binding:"required"`
	Capacity    *int     `json:"capacity,omitempty"`
}

// SessionWithSpeakers includes full speaker details
type SessionWithSpeakers struct {
	Session
	Speakers []Speaker `json:"speakers"`
}

// DesignationBreakdown represents analytics data
type DesignationBreakdown struct {
	Designation string `json:"designation"`
	Count       int    `json:"count"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
	Message string `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

