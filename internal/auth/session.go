package auth

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type SessionData struct {
	Username string      `json:"username"`
	Token    string      `json:"token"`
	User     UserDetails `json:"user"`
}

func getSessionFilePath() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".gitcms", "session.json")
}

func LoadSession() (*SessionData, error) {
	path := getSessionFilePath()
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var session SessionData
	if err := json.Unmarshal(data, &session); err != nil {
		return nil, err
	}
	return &session, nil
}

func SaveSession(data *SessionData) error {
	path := getSessionFilePath()
	_ = os.MkdirAll(filepath.Dir(path), 0755)

	content, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, content, 0600)
}

func ClearSession() error {
	return os.Remove(getSessionFilePath())
}
