import {Button} from "@/components/ui/button"
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {FileText, Plus, Settings} from "lucide-react"
import {useProjectStore} from "@/stores/project-store";
import {useNavigate} from "@tanstack/react-router";


export function ProjectMenu() {
    const projectList = Object.values(useProjectStore((state) => state.projects))
    const setSelectedProject = useProjectStore((state) => state.setSelectedProject)
    const navigate = useNavigate()


    function handleConfigure(id: string) {
        setSelectedProject(id)
    }

    function handleManageData(id: string) {
        navigate({
            to: '/projects/$projectId',
            params: { projectId: id },
        })

    }

    return (
        <div className="h-full w-full overflow-auto bg-background text-foreground p-4 flex flex-col items-center">
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
                                <Settings className="mr-2 h-4 w-4"/> Configure
                            </Button>
                            <Button onClick={() => handleManageData(project.id)}>
                                <FileText className="mr-2 h-4 w-4"/> Manage Data
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
