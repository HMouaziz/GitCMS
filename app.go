package main

import (
	"GitCMS/internal/auth"
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) StartGitHubLogin() (map[string]string, error) {
	codeResp, err := auth.StartDeviceFlow()
	if err != nil {
		return nil, err
	}
	return map[string]string{
		"userCode":   codeResp.UserCode,
		"verifyUrl":  codeResp.VerificationURI,
		"deviceCode": codeResp.DeviceCode,
		"interval":   fmt.Sprintf("%d", codeResp.Interval),
	}, nil
}

func (a *App) CompleteGitHubLogin(deviceCode string, interval int) (string, error) {
	token, err := auth.PollForAccessToken(deviceCode, interval)
	if err != nil {
		return "", err
	}
	return token, nil
}
