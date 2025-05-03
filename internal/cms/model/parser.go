package model

type Parser interface {
	Parse(raw []byte) (ParsedFile, error)
	Serialize(parsed ParsedFile) ([]byte, error)
}

type ParsedItem struct {
	ID       string                 `json:"id"`       // unique file or entry ID
	Metadata map[string]interface{} `json:"metadata"` // YAML frontmatter or JSON fields
	Content  string                 `json:"content"`  // markdown body or null for JSON
}

type ParsedFile struct {
	Items []ParsedItem `json:"items"`
	Raw   []byte       `json:"-"`
}
