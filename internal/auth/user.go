package auth

import (
	"context"
	"fmt"
	"github.com/google/go-github/v53/github"
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

// GetUserDetailsFromClient fetches details for *the already-authenticated* user.
func GetUserDetailsFromClient(ctx context.Context, gh *github.Client) (UserDetails, error) {
	user, _, err := gh.Users.Get(ctx, "") // "" → current user
	if err != nil {
		return UserDetails{}, fmt.Errorf("failed to get user: %w", err)
	}

	name := user.GetName()
	var lastName string
	if name != "" {
		parts := strings.Fields(name)
		if len(parts) > 1 {
			lastName = parts[len(parts)-1]
			name = strings.Join(parts[:len(parts)-1], " ")
		}
	}

	avatar := user.GetAvatarURL()

	// Attempt to get primary/verified email
	var email string
	emails, _, _ := gh.Users.ListEmails(ctx, nil)
	for _, e := range emails {
		if e.GetVerified() && (e.GetPrimary() || email == "") {
			email = e.GetEmail()
			if e.GetPrimary() {
				break
			}
		}
	}

	return UserDetails{
		Username:  user.GetLogin(),
		Name:      name,
		LastName:  lastName,
		Email:     email,
		AvatarURL: avatar,
	}, nil
}
