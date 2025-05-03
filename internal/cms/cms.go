package cms

import (
	"GitCMS/internal/cms/manager"
	"GitCMS/internal/cms/model"
	"GitCMS/internal/github"
)

type CMS struct {
	GitHubClient   *github.Client
	ProjectManager *manager.ProjectManager
	ConfigManager  *manager.ConfigManager
}

// NewCMS creates a new CMS instance
func NewCMS(client *github.Client) *CMS {
	return &CMS{
		GitHubClient:   client,
		ProjectManager: manager.NewProjectManager(client),
	}
}

func (c *CMS) ListProjects() ([]model.Project, error) {
	return c.ProjectManager.ListProjects(), nil
}

func (c *CMS) AddProject(p model.Project) error {
	return c.ProjectManager.AddProject(p)
}

func (c *CMS) EditProject(id string, newName string, newConfigPath string) error {
	return c.ProjectManager.EditProject(id, newName, newConfigPath)
}

func (c *CMS) RemoveProject(id string) error {
	return c.ProjectManager.RemoveProject(id)
}

func (c *CMS) LoadConfig(projectId string) (*model.Config, error) {
	return c.ConfigManager.Load(projectId)
}

func (c *CMS) CreateInitialConfig(projectId string) error {
	return c.ConfigManager.CreateInitial(projectId)
}
