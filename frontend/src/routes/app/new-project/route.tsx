import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {NewProjectForm} from "@/components/Project/NewProjectForm";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute('/app/new-project')({
  component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
  return <div className="flex h-full flex-col items-center justify-center relative">
            <Button className='absolute top-10 left-10' onClick={() => navigate({ to: "/app/main-menu" })}>Back</Button>
            <NewProjectForm/>
        </div>
}
