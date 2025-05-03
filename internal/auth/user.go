package auth

import (
	"context"
	"fmt"
	"github.com/google/go-github/v53/github"
	"golang.org/x/oauth2"
	"strings"
)

// UserDetails holds the GitHub user's details.
type UserDetails struct {
	Username  string `json:"username"`
	Name      string `json:"name"`
	LastName  string `json:"lastName,omitempty"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatarUrl"`
}

// GetUserDetails retrieves available GitHub user details (name, last name, email, avatar URL).
// Missing fields are returned as empty strings; errors are only returned for network or auth issues.
func GetUserDetails(username string) (UserDetails, error) {
	token, exists := tokenStore[username]
	if !exists {
		return UserDetails{}, fmt.Errorf("token not found for user %s", username)
	}

	ctx := context.Background()
	client := github.NewClient(oauth2.NewClient(ctx, oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})))
	user, _, err := client.Users.Get(ctx, username)
	if err != nil {
		return UserDetails{}, fmt.Errorf("failed to get user details: %v", err)
	}

	// Extract name and attempt to derive last name
	name := user.GetName()
	var lastName string
	if name != "" {
		parts := strings.Fields(name)
		if len(parts) > 1 {
			lastName = parts[len(parts)-1]
			name = strings.Join(parts[:len(parts)-1], " ")
		}
	}

	// Get avatar URL
	avatarURL := user.GetAvatarURL()

	// Fetch email using the Emails API
	var email string
	emails, _, err := client.Users.ListEmails(ctx, nil)
	if err != nil {
		// Log the error but continue with empty email (per requirement)
		fmt.Printf("Failed to fetch emails: %v\n", err)
	} else {
		// Find the primary or first verified email
		for _, e := range emails {
			if e.GetVerified() && e.GetPrimary() {
				email = e.GetEmail()
				break
			}
			if e.GetVerified() && email == "" {
				email = e.GetEmail() // Fallback to any verified email
			}
		}
	}

	return UserDetails{
		Username:  username,
		Name:      name,
		LastName:  lastName,
		Email:     email,
		AvatarURL: avatarURL,
	}, nil
}
