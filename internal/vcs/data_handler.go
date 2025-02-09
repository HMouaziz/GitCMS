package vcs

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
)

type Conflict struct {
	Path     string      `json:"path"`
	Local    interface{} `json:"local"`
	Remote   interface{} `json:"remote"`
	Location string      `json:"location"`
}

type DataHandler struct {
	workingDir string
}

func NewDataHandler() *DataHandler {
	return &DataHandler{
		workingDir: ".",
	}
}

// SaveToFile saves content to a file
func (dh *DataHandler) SaveToFile(filePath string, content string) error {
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	if err := os.WriteFile(filePath, []byte(content), 0644); err != nil {
		return fmt.Errorf("failed to write file: %w", err)
	}

	return nil
}

// readJSONFile reads and unmarshals a JSON file
func (dh *DataHandler) readJSONFile(filePath string) (map[string]interface{}, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	var data map[string]interface{}
	if err := json.Unmarshal(content, &data); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON: %w", err)
	}

	return data, nil
}

// DetectConflicts identifies conflicts between local and remote JSON files
func (dh *DataHandler) DetectConflicts(localFile, remoteFile string) ([]Conflict, error) {
	local, err := dh.readJSONFile(localFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read local file: %w", err)
	}

	remote, err := dh.readJSONFile(remoteFile)
	if err != nil {
		return nil, fmt.Errorf("failed to read remote file: %w", err)
	}

	conflicts := dh.compareJSON("", local, remote)
	return conflicts, nil
}

// compareJSON recursively compares two JSON objects and returns conflicts
func (dh *DataHandler) compareJSON(path string, local, remote interface{}) []Conflict {
	var conflicts []Conflict

	if reflect.TypeOf(local) != reflect.TypeOf(remote) {
		conflicts = append(conflicts, Conflict{
			Path:     path,
			Local:    local,
			Remote:   remote,
			Location: "type_mismatch",
		})
		return conflicts
	}

	switch local := local.(type) {
	case map[string]interface{}:
		remoteMap := remote.(map[string]interface{})
		for key, localVal := range local {
			newPath := path
			if newPath == "" {
				newPath = key
			} else {
				newPath = path + "." + key
			}

			if remoteVal, exists := remoteMap[key]; exists {
				conflicts = append(conflicts, dh.compareJSON(newPath, localVal, remoteVal)...)
			} else {
				conflicts = append(conflicts, Conflict{
					Path:     newPath,
					Local:    localVal,
					Remote:   nil,
					Location: "key_removed",
				})
			}
		}

		for key, remoteVal := range remoteMap {
			if _, exists := local[key]; !exists {
				newPath := path
				if newPath == "" {
					newPath = key
				} else {
					newPath = path + "." + key
				}
				conflicts = append(conflicts, Conflict{
					Path:     newPath,
					Local:    nil,
					Remote:   remoteVal,
					Location: "key_added",
				})
			}
		}

	case []interface{}:
		remoteArr := remote.([]interface{})
		if len(local) != len(remoteArr) {
			conflicts = append(conflicts, Conflict{
				Path:     path,
				Local:    local,
				Remote:   remote,
				Location: "array_length_mismatch",
			})
		} else {
			for i := range local {
				newPath := fmt.Sprintf("%s[%d]", path, i)
				conflicts = append(conflicts, dh.compareJSON(newPath, local[i], remoteArr[i])...)
			}
		}

	default:
		if !reflect.DeepEqual(local, remote) {
			conflicts = append(conflicts, Conflict{
				Path:     path,
				Local:    local,
				Remote:   remote,
				Location: "value_mismatch",
			})
		}
	}

	return conflicts
}

// MergeJSONFiles merges two JSON files with conflict resolution
func (dh *DataHandler) MergeJSONFiles(localFile, remoteFile string) (string, error) {
	local, err := dh.readJSONFile(localFile)
	if err != nil {
		return "", fmt.Errorf("failed to read local file: %w", err)
	}

	remote, err := dh.readJSONFile(remoteFile)
	if err != nil {
		return "", fmt.Errorf("failed to read remote file: %w", err)
	}

	merged := dh.mergeJSON(local, remote)

	result, err := json.MarshalIndent(merged, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to marshal merged content: %w", err)
	}

	return string(result), nil
}

// mergeJSON recursively merges two JSON objects
func (dh *DataHandler) mergeJSON(local, remote interface{}) interface{} {
	switch local := local.(type) {
	case map[string]interface{}:
		remoteMap, ok := remote.(map[string]interface{})
		if !ok {
			return remote
		}

		result := make(map[string]interface{})
		// Copy local values
		for key, localVal := range local {
			if remoteVal, exists := remoteMap[key]; exists {
				result[key] = dh.mergeJSON(localVal, remoteVal)
			} else {
				result[key] = localVal
			}
		}
		// Add remote-only values
		for key, remoteVal := range remoteMap {
			if _, exists := local[key]; !exists {
				result[key] = remoteVal
			}
		}
		return result

	case []interface{}:
		remoteArr, ok := remote.([]interface{})
		if !ok {
			return remote
		}
		// For arrays, prefer remote version in case of conflict
		return remoteArr

	default:
		// For primitive values, prefer remote version
		return remote
	}
}
