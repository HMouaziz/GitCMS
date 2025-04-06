package auth

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

var clientID = os.Getenv("GITHUB_CLIENT_ID")

type DeviceCodeResponse struct {
	DeviceCode      string `json:"device_code"`
	UserCode        string `json:"user_code"`
	VerificationURI string `json:"verification_uri"`
	ExpiresIn       int    `json:"expires_in"`
	Interval        int    `json:"interval"`
}

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	Scope       string `json:"scope"`
	Error       string `json:"error"`
}

func StartDeviceFlow() (*DeviceCodeResponse, error) {
	body := fmt.Sprintf("client_id=%s&scope=read:user repo write:public_key", clientID)
	resp, err := http.Post(
		"https://github.com/login/device/code",
		"application/x-www-form-urlencoded",
		bytes.NewBufferString(body),
	)
	if err != nil {
		return nil, err
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(resp.Body)

	var data DeviceCodeResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}
	return &data, nil
}

func PollForAccessToken(deviceCode string, interval int) (string, error) {
	for {
		time.Sleep(time.Duration(interval) * time.Second)

		body := fmt.Sprintf(
			"client_id=%s&device_code=%s&grant_type=urn:ietf:params:oauth:grant-type:device_code",
			clientID, deviceCode,
		)

		resp, err := http.Post(
			"https://github.com/login/oauth/access_token",
			"application/x-www-form-urlencoded",
			bytes.NewBufferString(body),
		)
		if err != nil {
			return "", err
		}
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {

			}
		}(resp.Body)

		var result TokenResponse
		data, _ := io.ReadAll(resp.Body)
		err = json.Unmarshal(data, &result)
		if err != nil {
			return "", err
		}

		if result.AccessToken != "" {
			return result.AccessToken, nil
		}
		if result.Error == "authorization_pending" {
			continue
		}
		return "", errors.New("Authorization failed or was denied: " + result.Error)
	}
}
