package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	app := NewApp()

	auth := NewAuth()

	err2 := wails.Run(&options.App{
		Title:            "Git CMS",
		Width:            1920,
		Height:           1080,
		WindowStartState: options.Maximised,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Frameless:        true,
		Bind: []interface{}{
			app,
			auth,
		},
	})

	if err2 != nil {
		println("Error:", err2.Error())
	}
}
