package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v53/github"
	"golang.org/x/oauth2"
)

type Client struct {
	rawClient *github.Client
	token     string
	ctx       context.Context
}

func NewClient() *Client {
	ctx := context.Background()
	client := github.NewClient(nil) // unauthenticated client

	return &Client{
		rawClient: client,
		ctx:       ctx,
	}
}

// Authenticate upgrades the client to authenticated mode
func (c *Client) Authenticate(token string) {
	ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	tc := oauth2.NewClient(c.ctx, ts)
	c.rawClient = github.NewClient(tc)
	c.token = token
}

func (c *Client) ReadFile(owner, repo, path string) ([]byte, error) {
	content, _, _, err := c.rawClient.Repositories.GetContents(c.ctx, owner, repo, path, nil)
	if err != nil {
		return nil, fmt.Errorf("github get file failed: %w", err)
	}

	raw, err := content.GetContent()
	if err != nil {
		return nil, fmt.Errorf("content decode failed: %w", err)
	}

	return []byte(raw), nil
}

func (c *Client) WriteFile(owner, repo, path, message string, content []byte) error {
	// Check if the file exists to get SHA (for update vs. create)
	existing, _, _, err := c.rawClient.Repositories.GetContents(c.ctx, owner, repo, path, nil)

	var sha *string
	if err == nil && existing != nil {
		sha = existing.SHA
	}

	opts := &github.RepositoryContentFileOptions{
		Message: github.String(message),
		Content: content,
		SHA:     sha, // nil creates a new file
	}

	_, _, err = c.rawClient.Repositories.CreateFile(c.ctx, owner, repo, path, opts)
	return err
}

func (c *Client) GetRawClient() *github.Client {
	return c.rawClient
}

func (c *Client) Context() context.Context {
	return c.ctx
}
