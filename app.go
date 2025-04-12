package main

import (
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"net/http"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	go a.startCallbackServer()
}

func (a *App) startCallbackServer() {
	handler := http.NewServeMux()
	handler.HandleFunc("/callback", func(w http.ResponseWriter, r *http.Request) {
		code := r.URL.Query().Get("code")
		state := r.URL.Query().Get("state")
		if code == "" {
			http.Error(w, "No code provided", http.StatusBadRequest)
			return
		}
		runtime.LogDebug(a.ctx, "Received callback: code="+code+", state="+state)
		runtime.EventsEmit(a.ctx, "oauth-callback", code, state)

		w.Header().Set("Content-Type", "text/html")
		fmt.Fprintf(w, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Success</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
        <h2 class="text-xl font-semibold text-gray-800">Login successful! You can safely close this tab.</h2>
    </div>
</body>
</html>
`)
	})

	server := &http.Server{
		Addr:    ":2501",
		Handler: handler,
	}

	// Run server
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			runtime.LogError(a.ctx, "Callback server error: "+err.Error())
		}
	}()

	// Handle shutdown
	go func() {
		<-a.ctx.Done()
		if err := server.Shutdown(context.Background()); err != nil {
			runtime.LogError(a.ctx, "Callback server shutdown error: "+err.Error())
		}
	}()
}
