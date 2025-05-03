import {createFileRoute, redirect} from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = useAuth.getState().token
    return redirect({ to: token ? '/app/main-menu' : '/app/login' })
  },
  component: () => null,
})


