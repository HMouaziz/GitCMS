import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    username: string | null
    token: string | null
    setAuth: (username: string, token: string) => void
    logout: () => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            username: null,
            token: null,
            setAuth: (username, token) => set({ username, token }),
            logout: () => set({ username: null, token: null }),
        }),
        {
            name: "gitcms-auth",
        }
    )
)
