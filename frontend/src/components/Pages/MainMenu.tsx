import {Button} from "@/components/ui/button";
import {useProjectStore} from "@/stores/project-store";
import {LogoutButton} from "@/components/Auth/LogoutButton";
import {useNavigate} from "@tanstack/react-router";

export const MainMenu = () => {
    const projects = useProjectStore(state => state.projects)
    const navigate = useNavigate();

    function handleOpen() {
        navigate({to: '/projects'})
    }

    return (
        <div className="h-[calc(100vh-80px)] bg-background text-foreground p-4 flex flex-col items-center">
            <h1>Git CMS</h1>
            {Object.keys(projects).length === 0 ?
                <Button>New Project</Button> :
                <>
                    <Button onClick={handleOpen}>Open Project</Button>
                    <Button>New Project</Button>
                </>
            }
            <Button>Settings</Button>
            <LogoutButton/>
        </div>
    );
};