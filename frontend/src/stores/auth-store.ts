import { create } from 'zustand'
import {auth} from "../../wailsjs/go/models";
import UserDetails = auth.UserDetails;
import {GetUser, HandleCallback, IsAuthed, Logout} from "../../wailsjs/go/auth/Binding";

interface AuthState {
    isAuthed: boolean
    user: UserDetails | null
    initialise: () => Promise<void>
    loginWithCode: (code: string, state: string) => Promise<void>
    logout: () => Promise<void>
}

export const useAuth = create<AuthState>()((set) => ({
    isAuthed: false,
    user: null,

    initialise: async () => {
        if (await IsAuthed()) {
            const user = await GetUser()
            set({ isAuthed: true, user })
        }
    },

    /** Called after OAuth callback */
    loginWithCode: async (code, state) => {
        const username = await HandleCallback(code, state) // triggers backend save
        const user = await GetUser()
        set({ isAuthed: true, user })
        console.log('Logged-in as', username)
    },

    logout: async () => {
        await Logout()
        set({ isAuthed: false, user: null })
    },
}))
