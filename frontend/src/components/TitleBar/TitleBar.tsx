import {Button} from "@/components/ui/button";
import {Maximize2, Minimize2, X,} from "lucide-react";
import {Close, Maximise, Minimise,} from "../../../wailsjs/go/main/App"
import {AppMenu} from "@/components/TitleBar/AppMenu";
import {ProjectDropdownMenu} from "@/components/TitleBar/ProjectDropdownMenu";
import {useAuth} from "@/stores/auth-store";
import {Logo} from "@/components/ui/Logo";
import {useLocation} from "@tanstack/react-router";

export function TitleBar() {
    const isAuthed = useAuth((state) => state.token);
    const location = useLocation();
    const path = location.pathname;

    const shouldShowProjectSelector =
        !path.startsWith('/app/main-menu') && path !== '/projects'

    return (
        <header
            className="title-bar fixed top-0 left-0 right-0 z-50 h-10 w-screen bg-background text-foreground flex items-center justify-between border-b rounded-none">
            {isAuthed ? <AppMenu/> : <Logo className='size-10'/>}
            {isAuthed && shouldShowProjectSelector && <ProjectDropdownMenu/>}
            <div className="flex h-full">
                <Button variant='titleBar' size='headerIcon' onClick={Minimise} title="Minimize"><Minimize2/></Button>
                <Button variant='titleBar' size='headerIcon' onClick={Maximise}
                        title="Maximize"><Maximize2/></Button>
                <Button variant='titleBarDestructive' size='headerIcon' onClick={Close} title="Close"><X/></Button>
            </div>
        </header>
    )
}
