import { Button } from '@/components/ui/button'
import {useThemeStore} from "@/stores/theme-store";

export function ThemeSwitcher() {
    const { theme, setTheme } = useThemeStore()

    const cycleTheme = () => {
        const next: Record<string, 'light' | 'dark' | 'system'> = {
            light: 'dark',
            dark: 'system',
            system: 'light',
        }
        setTheme(next[theme])
    }

    return (
        <Button variant="ghost" onClick={cycleTheme}>
            Theme: {theme}
        </Button>
    )
}
