import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Settings, FileText } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/stores/auth-store"

export const mockRepos = [
    { id: 1, name: "ballet-school-site", dataTypes: ["Blog Posts: 5", "Events: 3"] },
    { id: 2, name: "personal-blog", dataTypes: ["Blog Posts: 2"] },
    { id: 3, name: "dance-events", dataTypes: ["Events: 1"] },
]

export function MainDashboard() {
    const { username, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate({ to: "/login" })
    }

    const handleManageData = (repo: string) => {
        navigate({ to: `/project/${repo}/data` })
    }

    const handleConfigure = (repo: string) => {
        navigate({ to: `/project/${repo}/config` })
    }

    return (
        <div className="bg-background text-foreground p-4">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">GitCMS</h1>
                <div className="flex items-center gap-4">
                    <p className="text-sm">Logged in as: {username}</p>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Projects</h2>
                    <Button onClick={() => navigate({ to: "/project" })}>
                        Add New Project
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mockRepos.map((repo) => (
                        <Card key={repo.name} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{repo.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-muted-foreground">
                                    {repo.dataTypes.map((data, index) => (
                                        <li key={index}>{data}</li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2">
                                <Button variant="outline" onClick={() => handleConfigure(repo.name)}>
                                    <Settings className="mr-2 h-4 w-4" /> Configure
                                </Button>
                                <Button onClick={() => handleManageData(repo.name)}>
                                    <FileText className="mr-2 h-4 w-4" /> Manage Data
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
