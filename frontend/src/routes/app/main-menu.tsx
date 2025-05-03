import {createFileRoute, redirect} from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";
import {MainMenu} from "@/components/Pages/MainMenu";

export const Route = createFileRoute('/app/main-menu')({
    beforeLoad: () => {
        const token = useAuth.getState().isAuthed
        if (!token) throw redirect({to: '/app/login'})
    },
    component: MainMenu,
})

