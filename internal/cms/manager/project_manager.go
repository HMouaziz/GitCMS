package manager

import (
	"GitCMS/internal/cms/model"
	"GitCMS/internal/github"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type ProjectManager struct {
	client   *github.Client
	projects []model.Project
}

func NewProjectManager(client *github.Client) *ProjectManager {
	return &ProjectManager{
		client:   client,
		projects: []model.Project{},
	}
}

const projectListFile = ".gitcms/projects.json"

func getProjectFilePath() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, projectListFile)
}

// LoadTrackedProjects loads projects from local storage
func (pm *ProjectManager) LoadTrackedProjects() error {
	path := getProjectFilePath()
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			pm.projects = []model.Project{}
			return nil
		}
		return err
	}

	var projects []model.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		return err
	}

	pm.projects = projects
	return nil
}

// SaveTrackedProjects saves projects to local storage
func (pm *ProjectManager) SaveTrackedProjects() error {
	path := getProjectFilePath()
	data, err := json.MarshalIndent(pm.projects, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

// --- Project Operations ---

func (pm *ProjectManager) ListProjects() []model.Project {
	return pm.projects
}

func (pm *ProjectManager) AddProject(p model.Project) error {
	// Prevent duplicate IDs
	for _, proj := range pm.projects {
		if proj.ID == p.ID {
			return fmt.Errorf("project with ID %s already exists", p.ID)
		}
	}

	pm.projects = append(pm.projects, p)
	return pm.SaveTrackedProjects()
}

func (pm *ProjectManager) EditProject(id string, newName string, newConfigPath string) error {
	for i, proj := range pm.projects {
		if proj.ID == id {
			pm.projects[i].Name = newName
			if newConfigPath != "" {
				pm.projects[i].ConfigRef = newConfigPath
			}
			return pm.SaveTrackedProjects()
		}
	}
	return fmt.Errorf("project with ID %s not found", id)
}

func (pm *ProjectManager) RemoveProject(id string) error {
	newProjects := []model.Project{}
	for _, proj := range pm.projects {
		if proj.ID != id {
			newProjects = append(newProjects, proj)
		}
	}

	if len(newProjects) == len(pm.projects) {
		return fmt.Errorf("project with ID %s not found", id)
	}

	pm.projects = newProjects
	return pm.SaveTrackedProjects()
}
