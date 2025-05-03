import {createFileRoute, redirect} from '@tanstack/react-router'
import {LoginScreen} from "@/components/Auth/LoginScreen";
import {useAuth} from "@/stores/auth-store";

export const Route = createFileRoute('/app/login')({
    beforeLoad: () => {
        const token = useAuth.getState().token
        if (token) throw redirect({to: '/app/main-menu'})
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex items-center justify-center bg-background text-foreground p-4">
            <LoginScreen/>
        </div>
    )
}
