package auth

import (
	"GitCMS/internal/github"
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"os"
)

var oauthConfig *oauth2.Config
var currentState string

type Auth struct {
	githubClient *github.Client
	currentUser  *UserDetails
	token        string
	isAuthed     bool
}

func NewAuth(client *github.Client) *Auth {
	_ = godotenv.Load(".env")
	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:2501/callback",
		Scopes:       []string{"repo", "user:email"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://github.com/login/oauth/authorize",
			TokenURL: "https://github.com/login/oauth/access_token",
		},
	}
	return &Auth{githubClient: client}
}

/* ---------- OAuth flow ---------- */

func GenerateRandomState() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func (a *Auth) StartOAuthLogin() (string, error) {
	state, err := GenerateRandomState()
	if err != nil {
		return "", err
	}
	currentState = state
	return oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline), nil
}

func (a *Auth) HandleCallback(code, state string) (string, error) {
	if state != currentState {
		return "", fmt.Errorf("invalid state")
	}

	ctx := context.Background()
	tok, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		return "", err
	}

	/* authenticate shared client */
	a.githubClient.Authenticate(tok.AccessToken)

	/* fetch authenticated user */
	ghUser, _, err := a.githubClient.GetRawClient().Users.Get(ctx, "")
	if err != nil {
		return "", err
	}

	username := ghUser.GetLogin()
	details, err := GetUserDetailsFromClient(ctx, a.githubClient.GetRawClient())
	if err != nil {
		return "", err
	}

	/* update in-memory state */
	a.currentUser = &details
	a.token = tok.AccessToken
	a.isAuthed = true

	/* persist session */
	if err := SaveSession(&SessionData{
		Username: username,
		Token:    tok.AccessToken,
		User:     details,
	}); err != nil {
		return "", fmt.Errorf("persist session: %w", err)
	}

	return username, nil
}

/* ---------- Session restore / logout ---------- */

func (a *Auth) RestoreLastSession() error {
	sess, err := LoadSession()
	if err != nil { // no file
		a.isAuthed = false
		return err
	}

	// Authenticate client with stored token
	a.githubClient.Authenticate(sess.Token)

	// === token validity probe ===
	_, _, err = a.githubClient.GetRawClient().Users.Get(context.Background(), "")
	if err != nil {
		_ = ClearSession()
		a.isAuthed = false
		return fmt.Errorf("invalid token: %w", err)
	}

	// accepted -> load state
	a.currentUser = &sess.User
	a.token = sess.Token
	a.isAuthed = true
	return nil
}

func (a *Auth) Logout() error {
	a.currentUser = nil
	a.token = ""
	a.isAuthed = false
	return ClearSession()
}

/* ---------- Convenience getters ---------- */

func (a *Auth) IsAuthed() bool { return a.isAuthed }

func (a *Auth) GetUser() (UserDetails, error) {
	if !a.isAuthed || a.currentUser == nil {
		return UserDetails{}, fmt.Errorf("not authenticated")
	}
	return *a.currentUser, nil
}

func (a *Auth) GetTokenHash() (string, error) {
	if !a.isAuthed {
		return "", fmt.Errorf("not authenticated")
	}
	hash := sha256.Sum256([]byte(a.token))
	return hex.EncodeToString(hash[:]), nil
}

/* ---------- GitHub helpers ---------- */

func (a *Auth) GetAvailableRepos() ([]string, error) {
	if !a.isAuthed {
		return nil, fmt.Errorf("not authenticated")
	}
	repos, _, err := a.githubClient.GetRawClient().
		Repositories.List(context.Background(), "", nil)
	if err != nil {
		return nil, err
	}
	var out []string
	for _, r := range repos {
		out = append(out, fmt.Sprintf("%s/%s", r.GetOwner().GetLogin(), r.GetName()))
	}
	return out, nil
}
