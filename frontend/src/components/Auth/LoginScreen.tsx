"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/stores/auth-store"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import {BrowserOpenURL, EventsOn} from "../../../wailsjs/runtime"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { HandleCallback, StartOAuthLogin} from "../../../wailsjs/go/auth/Binding";


export function LoginScreen() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { initialise, logout } = useAuth()
    const navigate = useNavigate()

    const startLogin = async () => {
        setLoading(true)
        setError("")

        try {
            const url = await StartOAuthLogin()
            BrowserOpenURL(url)

            /* Listen for custom event fired by your callback-page */
            const off = EventsOn("oauth-callback", async (code: string, state: string) => {
                try {
                    await HandleCallback(code, state)   // backend persists session
                    await initialise()                  // sync store from backend
                    await navigate({ to: "/app/main-menu" })
                } catch (e) {
                    await logout()                      // ensure clean state
                    setError("Login failed. Please try again.")
                } finally {
                    setLoading(false)
                    off()
                }
            })
        } catch (e) {
            setError("Failed to start GitHub login")
            setLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <Card className="w-full max-w-sm text-center">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">Welcome to GitCMS</h2>
                    <p className="text-sm text-muted-foreground">
                        Sign in with GitHub to manage your repositories.
                    </p>

                    <Button
                        className="w-full"
                        onClick={startLogin}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login with GitHub
                    </Button>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
            </Card>
        </div>
    )
}
