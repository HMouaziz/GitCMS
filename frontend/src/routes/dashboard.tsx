import {createFileRoute, redirect} from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";
import {Dashboard} from "@/components/Pages/Dashboard";

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        const token = useAuth.getState().token
        if (!token) throw redirect({to: '/login'})
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <Dashboard/>
}
