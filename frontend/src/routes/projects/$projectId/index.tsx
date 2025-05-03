import {createFileRoute, redirect} from '@tanstack/react-router'
import {useProjectStore} from "@/stores/project-store";

export const Route = createFileRoute('/projects/$projectId/')({
    loader: async ({params}) => {
        const project = useProjectStore.getState().projects[params.projectId]
        if (!project) {
            throw redirect({to: '/app/main-menu'})
        }
        useProjectStore.getState().setSelectedProject(params.projectId)
        return {project}
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {project} = Route.useLoaderData()
    return <div>Welcome to project: {project.name}</div>
}
