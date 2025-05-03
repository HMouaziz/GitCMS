import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {useProjectStore} from "@/stores/project-store";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Plus} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";

export const ProjectDropdownMenu = () => {
    const selectedProject = useProjectStore((state) => state.getSelectedProject());
    const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
    const projectRec = useProjectStore((state) => state.projects)
    const projects = Object.values(projectRec);
    const navigate = useNavigate();

    function handleSwitch(id: string) {
        navigate({
            to: '/projects/$projectId',
            params: { projectId: id },
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{selectedProject?.name ?? "Select a Project"}</DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-lg max-h-64'>
                <ScrollArea>
                    <DropdownMenuItem><Plus/>New Project...</DropdownMenuItem>
                    {selectedProject ? (
                        <>
                            <DropdownMenuSeparator/>
                            <DropdownMenuLabel>Current Project</DropdownMenuLabel>
                            <DropdownMenuLabel>{selectedProject?.name}</DropdownMenuLabel>
                        </>
                    ) : null
                    }
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                    {
                        projects.map((project) => (
                            <DropdownMenuItem key={project.id}
                                              onClick={() => handleSwitch(project.id)}>{project.name}</DropdownMenuItem>
                        ))
                    }
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};