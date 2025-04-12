package main

import (
	"GitCMS/internal/auth"
	"context"
)

type Auth struct {
	ctx context.Context
}

func NewAuth() *Auth {
	return &Auth{}
}

func (a *Auth) StartOAuthLogin() (string, error) {
	return auth.StartOAuthLogin()
}

func (a *Auth) HandleCallback(code, state string) (string, error) {
	return auth.HandleCallback(code, state)
}

func (a *Auth) GetState() string {
	return auth.GetState()
}

func (a *Auth) GetToken(username string) (string, error) {
	return auth.GetToken(username)
}
