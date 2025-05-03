package model

type Config struct {
	Version   string       `json:"version,omitempty"`
	Name      string       `json:"projectName"` // Display name
	ProjectID string       `json:"projectId"`   // e.g. "lydie/my-site"
	Content   []DataSource `json:"content"`     // All editable content models
}

type DataSource struct {
	ID      string            `json:"id"`                // Unique key like "posts" or "site"
	Label   string            `json:"label"`             // "Blog Posts", "Homepage", etc.
	Type    string            `json:"type"`              // "singleton" or "collection"
	Path    string            `json:"path"`              // e.g. "data/posts.json" or "posts/"
	Format  string            `json:"format"`            // "json", "markdown", "csv"
	Storage string            `json:"storage,omitempty"` // "single" or "multi"
	Fields  map[string]string `json:"fields,omitempty"`  // Field types (optional for now)
}
