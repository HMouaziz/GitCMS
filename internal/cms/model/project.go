package model

type Project struct {
	ID        string  `json:"id"`        // Internal unique ID (e.g. "lydie/my-site")
	Name      string  `json:"name"`      // Friendly display name, editable by user
	RepoName  string  `json:"repoName"`  // GitHub repository name (e.g. "my-site")
	Owner     string  `json:"owner"`     // GitHub user/org (e.g. "lydie")
	ConfigRef string  `json:"configRef"` // Path to config file in repo (e.g. ".gitcms/config.json")
	Config    *Config `json:"config"`    // Loaded config (optional)
}

type AddProjectInput struct {
	RepoName   string `json:"repoName"`   // e.g. "my-site"
	Owner      string `json:"owner"`      // e.g. "lydie"
	Name       string `json:"name"`       // optional display name
	ConfigPath string `json:"configPath"` // optional (default: .gitcms/config.json)
}

type EditProjectInput struct {
	ID         string `json:"id"`         // e.g. "lydie/my-site"
	NewName    string `json:"newName"`    // optional
	ConfigPath string `json:"configPath"` // optional
}

type RemoveProjectInput struct {
	ID string `json:"id"`
}
