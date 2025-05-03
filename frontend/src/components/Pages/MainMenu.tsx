import {Button} from "@/components/ui/button";
import {useProjectStore} from "@/stores/project-store";
import {LogoutButton} from "@/components/Auth/LogoutButton";
import {useNavigate} from "@tanstack/react-router";


export const MainMenu = () => {
    const projects = useProjectStore(state => state.projects)
    const navigate = useNavigate()

    function handleOpen() {
        navigate({ to: '/projects' })
    }

    function handleNew() {
        navigate({ to: '/app/new-project' })
    }

    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-foreground">
            <h1 className="text-2xl font-bold">Git CMS</h1>

            <div className='flex flex-col gap-4'>
                {Object.keys(projects).length === 0 ? (
                    <Button onClick={handleNew}>New Project</Button>
                ) : (
                    <>
                        <Button onClick={handleOpen}>Open Project</Button>
                        <Button onClick={handleNew}>New Project</Button>
                    </>
                )}

                <Button>Settings</Button>
                <LogoutButton />
            </div>

        </div>
    )
}
