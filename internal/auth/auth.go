package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"github.com/google/go-github/v53/github"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"os"
)

var oauthConfig *oauth2.Config
var tokenStore = make(map[string]string)
var currentState string

func init() {
	if err := godotenv.Load(".env"); err != nil {
		fmt.Println("Error loading .env file", err)
	}
	oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:2501/callback",
		Scopes:       []string{"repo"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://github.com/login/oauth/authorize",
			TokenURL: "https://github.com/login/oauth/access_token",
		},
	}
}

func GetState() string {
	return currentState
}

func GenerateRandomState() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("failed to generate random state: %v", err)
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func StartOAuthLogin() (string, error) {
	state, err := GenerateRandomState()
	if err != nil {
		return "", err
	}
	currentState = state
	return oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.SetAuthURLParam("prompt", "login")), nil
}

func HandleCallback(code, state string) (string, error) {
	if state != currentState {
		return "", fmt.Errorf("invalid state")
	}

	ctx := context.Background()
	token, err := oauthConfig.Exchange(ctx, code)
	if err != nil {
		return "", fmt.Errorf("failed to exchange token: %w", err)
	}

	client := github.NewClient(oauthConfig.Client(ctx, token))
	user, _, err := client.Users.Get(ctx, "")
	if err != nil {
		return "", fmt.Errorf("failed to get user: %w", err)
	}

	username := user.GetLogin()
	tokenStore[username] = token.AccessToken
	return username, nil
}

func GetToken(username string) (string, error) {
	token, exists := tokenStore[username]
	if !exists {
		return "", fmt.Errorf("token not found for user %s", username)
	}
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:]), nil
}
