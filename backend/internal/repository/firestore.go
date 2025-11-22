package repository

import (
	"context"
	"fmt"

	"appdirect-workshop-backend/internal/models"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/option"
)

type Repository struct {
	client         *firestore.Client
	subDocID       string
	attendeesColl  *firestore.CollectionRef
	speakersColl   *firestore.CollectionRef
	sessionsColl   *firestore.CollectionRef
}

func NewRepository(ctx context.Context, projectID, subDocID, serviceAccountPath string) (*Repository, error) {
	var client *firestore.Client
	var err error

	if serviceAccountPath != "" {
		// Use service account file
		opt := option.WithCredentialsFile(serviceAccountPath)
		client, err = firestore.NewClient(ctx, projectID, opt)
	} else {
		// Try to use default credentials (for GCP environments)
		client, err = firestore.NewClient(ctx, projectID)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to create firestore client: %w", err)
	}

	// Create subcollection reference
	docRef := client.Collection("workshop").Doc(subDocID)
	
	repo := &Repository{
		client:        client,
		subDocID:      subDocID,
		attendeesColl: docRef.Collection("attendees"),
		speakersColl:  docRef.Collection("speakers"),
		sessionsColl:  docRef.Collection("sessions"),
	}

	return repo, nil
}

func (r *Repository) Close() error {
	return r.client.Close()
}

// Attendee operations
func (r *Repository) CreateAttendee(ctx context.Context, attendee *models.Attendee) error {
	_, err := r.attendeesColl.Doc(attendee.ID).Set(ctx, attendee)
	return err
}

func (r *Repository) GetAttendee(ctx context.Context, id string) (*models.Attendee, error) {
	doc, err := r.attendeesColl.Doc(id).Get(ctx)
	if err != nil {
		return nil, err
	}

	var attendee models.Attendee
	if err := doc.DataTo(&attendee); err != nil {
		return nil, err
	}
	attendee.ID = doc.Ref.ID
	return &attendee, nil
}

func (r *Repository) GetAllAttendees(ctx context.Context) ([]models.Attendee, error) {
	docs, err := r.attendeesColl.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	attendees := make([]models.Attendee, 0, len(docs))
	for _, doc := range docs {
		var attendee models.Attendee
		if err := doc.DataTo(&attendee); err != nil {
			continue
		}
		attendee.ID = doc.Ref.ID
		attendees = append(attendees, attendee)
	}

	return attendees, nil
}

func (r *Repository) GetAttendeeCount(ctx context.Context) (int, error) {
	docs, err := r.attendeesColl.Documents(ctx).GetAll()
	if err != nil {
		return 0, err
	}
	return len(docs), nil
}

func (r *Repository) DeleteAttendee(ctx context.Context, id string) error {
	_, err := r.attendeesColl.Doc(id).Delete(ctx)
	return err
}

// Speaker operations
func (r *Repository) CreateSpeaker(ctx context.Context, speaker *models.Speaker) error {
	_, err := r.speakersColl.Doc(speaker.ID).Set(ctx, speaker)
	return err
}

func (r *Repository) GetSpeaker(ctx context.Context, id string) (*models.Speaker, error) {
	doc, err := r.speakersColl.Doc(id).Get(ctx)
	if err != nil {
		return nil, err
	}

	var speaker models.Speaker
	if err := doc.DataTo(&speaker); err != nil {
		return nil, err
	}
	speaker.ID = doc.Ref.ID
	return &speaker, nil
}

func (r *Repository) GetAllSpeakers(ctx context.Context) ([]models.Speaker, error) {
	docs, err := r.speakersColl.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	speakers := make([]models.Speaker, 0, len(docs))
	for _, doc := range docs {
		var speaker models.Speaker
		if err := doc.DataTo(&speaker); err != nil {
			continue
		}
		speaker.ID = doc.Ref.ID
		speakers = append(speakers, speaker)
	}

	return speakers, nil
}

func (r *Repository) UpdateSpeaker(ctx context.Context, id string, speaker *models.Speaker) error {
	speaker.ID = id
	_, err := r.speakersColl.Doc(id).Set(ctx, speaker)
	return err
}

func (r *Repository) DeleteSpeaker(ctx context.Context, id string) error {
	_, err := r.speakersColl.Doc(id).Delete(ctx)
	return err
}

// Session operations
func (r *Repository) CreateSession(ctx context.Context, session *models.Session) error {
	_, err := r.sessionsColl.Doc(session.ID).Set(ctx, session)
	return err
}

func (r *Repository) GetSession(ctx context.Context, id string) (*models.Session, error) {
	doc, err := r.sessionsColl.Doc(id).Get(ctx)
	if err != nil {
		return nil, err
	}

	var session models.Session
	if err := doc.DataTo(&session); err != nil {
		return nil, err
	}
	session.ID = doc.Ref.ID
	return &session, nil
}

func (r *Repository) GetAllSessions(ctx context.Context) ([]models.Session, error) {
	docs, err := r.sessionsColl.Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	sessions := make([]models.Session, 0, len(docs))
	for _, doc := range docs {
		var session models.Session
		if err := doc.DataTo(&session); err != nil {
			continue
		}
		session.ID = doc.Ref.ID
		sessions = append(sessions, session)
	}

	return sessions, nil
}

func (r *Repository) UpdateSession(ctx context.Context, id string, session *models.Session) error {
	session.ID = id
	_, err := r.sessionsColl.Doc(id).Set(ctx, session)
	return err
}

func (r *Repository) DeleteSession(ctx context.Context, id string) error {
	_, err := r.sessionsColl.Doc(id).Delete(ctx)
	return err
}

// Get sessions with speaker details
func (r *Repository) GetSessionsWithSpeakers(ctx context.Context) ([]models.SessionWithSpeakers, error) {
	sessions, err := r.GetAllSessions(ctx)
	if err != nil {
		return nil, err
	}

	speakers, err := r.GetAllSpeakers(ctx)
	if err != nil {
		return nil, err
	}

	// Create speaker map for quick lookup
	speakerMap := make(map[string]models.Speaker)
	for _, speaker := range speakers {
		speakerMap[speaker.ID] = speaker
	}

	// Build sessions with speakers
	sessionsWithSpeakers := make([]models.SessionWithSpeakers, 0, len(sessions))
	for _, session := range sessions {
		sessionWithSpeakers := models.SessionWithSpeakers{
			Session: session,
			Speakers: make([]models.Speaker, 0),
		}

		for _, speakerID := range session.SpeakerIDs {
			if speaker, ok := speakerMap[speakerID]; ok {
				sessionWithSpeakers.Speakers = append(sessionWithSpeakers.Speakers, speaker)
			}
		}

		sessionsWithSpeakers = append(sessionsWithSpeakers, sessionWithSpeakers)
	}

	return sessionsWithSpeakers, nil
}

// Analytics operations
func (r *Repository) GetDesignationBreakdown(ctx context.Context) ([]models.DesignationBreakdown, error) {
	attendees, err := r.GetAllAttendees(ctx)
	if err != nil {
		return nil, err
	}

	// Count by designation
	designationMap := make(map[string]int)
	for _, attendee := range attendees {
		designationMap[attendee.Designation]++
	}

	// Convert to slice
	breakdown := make([]models.DesignationBreakdown, 0, len(designationMap))
	for designation, count := range designationMap {
		breakdown = append(breakdown, models.DesignationBreakdown{
			Designation: designation,
			Count:       count,
		})
	}

	return breakdown, nil
}

