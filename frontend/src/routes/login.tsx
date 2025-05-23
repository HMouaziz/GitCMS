import {createFileRoute, redirect} from '@tanstack/react-router'
import {LoginScreen} from "@/components/Auth/LoginScreen";
import {useAuth} from "@/stores/auth-store";

export const Route = createFileRoute('/login')({
    beforeLoad: () => {
        const token = useAuth.getState().token
        if (token) throw redirect({to: '/dashboard'})
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="h-screen flex items-center justify-center bg-background text-foreground p-4">
            <LoginScreen/>
        </div>
    )
}
