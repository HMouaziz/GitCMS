import {createFileRoute, redirect} from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";

export const Route = createFileRoute('/project')({
    beforeLoad: () => {
        const token = useAuth.getState().token
        if (!token) throw redirect({to: '/login'})
    },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/project"!</div>
}
