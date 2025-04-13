import { MonitorCog, Moon, Sun } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Logo} from "@/components/ui/Logo";
import {ThemeMode, useThemeStore} from "@/stores/theme-store";
import {useShallow} from "zustand/react/shallow";
import {useAuth} from "@/stores/auth-store";
import {useNavigate} from "@tanstack/react-router";

export const AppMenu = () => {
    const mode = useThemeStore((state) => state.theme)
    const setTheme = useThemeStore((state) => state.setTheme)

    const logout = useAuth((state) => state.logout)
    const navigate = useNavigate()

    function handleThemeSwitch(value:string) {
       setTheme(value as ThemeMode)
    }

    function handleLogout() {
        logout()
        navigate({ to: '/login' })    }

    return (
        <DropdownMenu >
            <DropdownMenuTrigger><Logo className='size-10'/></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                       <DropdownMenuRadioGroup value={mode} onValueChange={handleThemeSwitch}>
                           <DropdownMenuRadioItem value="light"><Sun/>Light Mode</DropdownMenuRadioItem>
                           <DropdownMenuRadioItem value="dark"><Moon/>Dark Mode</DropdownMenuRadioItem>
                           <DropdownMenuRadioItem value="system"><MonitorCog/>System</DropdownMenuRadioItem>
                       </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Help</DropdownMenuItem>
                <DropdownMenuLabel>Version n<sup>o</sup></DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};