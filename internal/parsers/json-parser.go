package parsers

import "encoding/json"

type JSONParser struct{}

func (p *JSONParser) Parse(content string, config map[string]interface{}) ([]DataItem, error) {
	var data []DataItem
	if err := json.Unmarshal([]byte(content), &data); err != nil {
		return nil, err
	}
	return data, nil
}

func (p *JSONParser) Serialize(items []DataItem, config map[string]interface{}) (string, error) {
	bytes, err := json.MarshalIndent(items, "", "  ")
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}
