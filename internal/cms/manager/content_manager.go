package manager

import (
	"GitCMS/internal/cms/model"
	"GitCMS/internal/github"
)

type ContentManager struct {
	client      *github.Client
	project     *model.Project
	dataSources []model.DataSource
}

func NewContentManager(client *github.Client, project *model.Project) *ContentManager {
	return &ContentManager{
		client:      client,
		project:     project,
		dataSources: project.Config.Content,
	}
}

// Later: List datasources (collections + singletons)
// Later: Load content entries
// Later: Save or delete content entries
