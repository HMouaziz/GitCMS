import {create} from 'zustand'
import {persist} from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
    theme: ThemeMode
    setTheme: (theme: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            setTheme: (theme) => {
                set({theme})
                applyTheme(theme)
            },
        }),
        {
            name: 'gitcms-theme',
        }
    )
)

function applyTheme(mode: ThemeMode) {
    const root = document.documentElement
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = mode === 'dark' || (mode === 'system' && darkQuery.matches)

    root.classList.toggle('dark', isDark)
}
