import {useRouterState} from "@tanstack/react-router"
import {Button} from "@/components/ui/button";
import {Maximize2, Minimize2, X,} from "lucide-react";
import {Logo} from "@/components/ui/Logo";
import {Close, Maximise, Minimise,} from "../../../wailsjs/go/main/App"

export function TitleBar() {
    const {location} = useRouterState()

    const title = (() => {
        if (location.pathname.startsWith("/dashboard")) return "Dashboard"
        if (location.pathname === "/login") return "Login"
        return "Git CMS"
    })()

    console.log("Window runtime: ", Window)

    return (
        <div
            className="title-bar h-10 w-full bg-background text-foreground flex items-center justify-between px-[3px] border-b rounded-none">
            <Logo className="title-bar-child"/>
            <div className="title-bar-child text-sm font-semibold">{title}</div>
            <div className="title-bar-child flex">
                <Button variant='titleBar' size='icon' onClick={Minimise} title="Minimize"><Minimize2/></Button>
                <Button variant='titleBar' size='icon' onClick={Maximise}
                        title="Maximize"><Maximize2/></Button>
                <Button variant='titleBarDestructive' size='icon' onClick={Close} title="Close" className='rounded-tr-sm'><X/></Button>
            </div>
        </div>
    )
}
