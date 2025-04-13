package parsers

type DataItem map[string]interface{}

type Parser interface {
	Parse(content string, config map[string]interface{}) ([]DataItem, error)
	Serialize(items []DataItem, config map[string]interface{}) (string, error)
}

var ParserRegistry = map[string]Parser{
	"json": &JSONParser{},
}

func RegisterParser(name string, parser Parser) {
	ParserRegistry[name] = parser
}
