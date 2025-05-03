import {create} from "zustand"
import {persist} from "zustand/middleware"
import {auth} from "../../wailsjs/go/models";
import UserDetails = auth.UserDetails;


type AuthState = {
    user: UserDetails| null
    username: string | null
    token: string | null
    setAuth: (username: string, token: string) => void
    setUser: (user: UserDetails) => void
    logout: () => void
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            username: null,
            token: null,
            setAuth: (username, token) => set({username, token}),
            setUser: (user) => set({user}),
            logout: () => set({username: null, token: null}),
        }),
        {
            name: "gitcms-auth",
        }
    )
)
