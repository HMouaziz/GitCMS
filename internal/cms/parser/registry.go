package parser

import "GitCMS/internal/cms/model"

var parsers = map[string]*model.Parser{}

func Register(format string, p *model.Parser) {
	parsers[format] = p
}

func Get(format string) (*model.Parser, bool) {
	p, ok := parsers[format]
	return p, ok
}
