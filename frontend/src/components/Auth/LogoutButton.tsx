import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";

export function LogoutButton() {
    const logout = useAuth((state) => state.logout)
    const navigate = useNavigate()

    return (
        <Button
            onClick={() => {
                logout()
                navigate({ to: '/app/login' })
            }}
        >
            Log out
        </Button>
    )
}
