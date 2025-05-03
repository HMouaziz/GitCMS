package manager

import (
	"GitCMS/internal/cms/model"
	"GitCMS/internal/github"
	"encoding/json"
	"fmt"
	"strings"
)

type ConfigManager struct {
	client *github.Client
}

func NewConfigManager(client *github.Client) *ConfigManager {
	return &ConfigManager{client: client}
}

func (cm *ConfigManager) Load(projectId string) (*model.Config, error) {
	parts := strings.Split(projectId, "/")
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid project ID: %s", projectId)
	}
	owner, repo := parts[0], parts[1]

	data, err := cm.client.ReadFile(owner, repo, ".gitcms/config.json")
	if err != nil {
		return nil, fmt.Errorf("failed to read config: %w", err)
	}

	var cfg model.Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("failed to parse config: %w", err)
	}

	return &cfg, nil
}

func (cm *ConfigManager) CreateInitial(projectId string) error {
	parts := strings.Split(projectId, "/")
	if len(parts) != 2 {
		return fmt.Errorf("invalid project ID: %s", projectId)
	}
	owner, repo := parts[0], parts[1]

	initialConfig := model.Config{
		Version:   "1.0",
		Name:      repo,
		ProjectID: projectId,
		Content:   []model.DataSource{},
	}

	data, err := json.MarshalIndent(initialConfig, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to encode config: %w", err)
	}

	err = cm.client.WriteFile(owner, repo, ".gitcms/config.json", "Add initial GitCMS config", data)
	if err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}
