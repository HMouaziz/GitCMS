import {createFileRoute, redirect} from '@tanstack/react-router'
import {useAuth} from "@/stores/auth-store";

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const isAuthed = useAuth.getState().isAuthed
    return redirect({ to: isAuthed ? '/app/main-menu' : '/app/login' })
  },
  component: () => null,
})


