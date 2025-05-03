import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/stores/auth-store"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import {BrowserOpenURL, EventsOn} from "../../../wailsjs/runtime"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {GetToken, GetUserDetails, HandleCallback, StartOAuthLogin} from "../../../wailsjs/go/auth/Binding";

export function LoginScreen() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { setAuth, setUser } = useAuth()

    const startLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const url = await StartOAuthLogin()
            BrowserOpenURL(url)

            const unsubscribe = EventsOn("oauth-callback", async (code: string, state: string) => {
                try {
                    const username = await HandleCallback(code, state)
                    const token = await GetToken(username)
                    setAuth(username, token)
                    const user = await GetUserDetails(username)
                    setUser(user)
                    setLoading(false)
                    await navigate({ to: "/app/main-menu" })
                } catch (err) {
                    setError("Login failed, please try again")
                    setLoading(false)
                }
                unsubscribe()
            })
        } catch (err) {
            setError("Failed to start GitHub login")
            setLoading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-80px)] flex-1 flex items-center justify-center bg-background text-foreground p-4">
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
                        {loading ? (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : null}
                        Login with GitHub
                    </Button>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
            </Card>
        </div>
    )
}
