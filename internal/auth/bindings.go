package auth

import (
	"GitCMS/internal/github"
)

type Binding struct {
	auth *Auth
}

func NewAuthBinding(client *github.Client) *Binding {
	b := &Binding{auth: NewAuth(client)}
	_ = b.auth.RestoreLastSession()
	return b
}

func (b *Binding) StartOAuthLogin() (string, error) {
	return b.auth.StartOAuthLogin()
}

func (b *Binding) HandleCallback(code, state string) (string, error) {
	return b.auth.HandleCallback(code, state)
}

func (b *Binding) RestoreLastSession() error            { return b.auth.RestoreLastSession() }
func (b *Binding) Logout() error                        { return b.auth.Logout() }
func (b *Binding) IsAuthed() bool                       { return b.auth.IsAuthed() }
func (b *Binding) GetUser() (UserDetails, error)        { return b.auth.GetUser() }
func (b *Binding) GetAvailableRepos() ([]string, error) { return b.auth.GetAvailableRepos() }
