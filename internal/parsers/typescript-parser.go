package parsers

import (
	"encoding/json"
	"fmt"
	"strings"
)

type TypeScriptParser struct{}

func (p *TypeScriptParser) Parse(content string, config map[string]interface{}) ([]DataItem, error) {
	variable := config["variable"].(string)
	start := strings.Index(content, "[")
	end := strings.LastIndex(content, "]")
	arrayContent := content[start : end+1]
	var items []DataItem
	if err := json.Unmarshal([]byte(arrayContent), &items); err != nil {
		return nil, err
	}
	return items, nil
}

func (p *TypeScriptParser) Serialize(items []DataItem, config map[string]interface{}) (string, error) {
	variable := config["variable"].(string)
	data, _ := json.MarshalIndent(items, "  ", "  ")
	return fmt.Sprintf("export const %s = %s;", variable, string(data)), nil
}
