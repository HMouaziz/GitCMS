import {createFileRoute, redirect} from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";
import {MainDashboard} from "@/components/Pages/Dashboard";

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        const token = useAuth.getState().token
        if (!token) throw redirect({to: '/login'})
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <MainDashboard/>
}
