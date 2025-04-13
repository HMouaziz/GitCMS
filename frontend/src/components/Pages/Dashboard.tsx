import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {LogOut, Settings, FileText, Plus} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/stores/auth-store"
import {useProjectStore} from "@/stores/project-store";


export function MainDashboard() {
    const projectList = Object.values(useProjectStore((state) => state.projects))
    const setSelectedProject = useProjectStore((state) => state.setSelectedProject)


    function handleConfigure(id: string) {
        setSelectedProject(id)
    }

    function handleManageData(id: string) {
        setSelectedProject(id)
    }

    return (
        <div className="bg-background text-foreground p-4 flex flex-col items-center">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Projects</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projectList.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow min-w-lg ">
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                            </CardHeader>
                            <CardFooter className="flex justify-between gap-2">
                                <Button variant="outline" onClick={() => handleConfigure(project.id)}>
                                    <Settings className="mr-2 h-4 w-4" /> Configure
                                </Button>
                                <Button onClick={() => handleManageData(project.id)}>
                                    <FileText className="mr-2 h-4 w-4" /> Manage Data
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <Card className="hover:shadow-lg transition-shadow flex justify-center items-center">
                        <Button variant='outlineThick'><Plus/> Add new</Button>
                    </Card>
                </div>
        </div>
    )
}
