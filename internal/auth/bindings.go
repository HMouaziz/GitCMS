package auth

import (
	"GitCMS/internal/github"
	"fmt"
)

type Binding struct {
	auth *Auth
}

func NewAuthBinding(client *github.Client) *Binding {
	return &Binding{
		auth: NewAuth(client),
	}
}

func (b *Binding) StartOAuthLogin() (string, error) {
	return b.auth.StartOAuthLogin()
}

func (b *Binding) HandleCallback(code, state string) (string, error) {
	return b.auth.HandleCallback(code, state)
}

func (b *Binding) GetState() string {
	return b.auth.GetState()
}

func (b *Binding) GetToken(username string) (string, error) {
	return b.auth.GetToken(username)
}

func (b *Binding) GetRawToken(username string) (string, error) {
	token, exists := b.auth.GetRawToken(username)
	if !exists {
		return "", fmt.Errorf("token not found for user %s", username)
	}
	return token, nil
}

func (b *Binding) GetUserDetails(username string) (UserDetails, error) {
	return GetUserDetails(username)
}
