import {Button} from "@/components/ui/button";
import {Maximize2, Minimize2, X,} from "lucide-react";
import {Close, Maximise, Minimise,} from "../../../wailsjs/go/main/App"
import {AppMenu} from "@/components/TitleBar/AppMenu";
import {ProjectDropdownMenu} from "@/components/TitleBar/ProjectDropdownMenu";

export function TitleBar() {


    return (
        <header
            className="title-bar h-10 w-full bg-background text-foreground flex items-center justify-between border-b rounded-none">
            <AppMenu/>
            <ProjectDropdownMenu/>
            <div className="flex h-full">
                <Button variant='titleBar' size='headerIcon' onClick={Minimise} title="Minimize"><Minimize2/></Button>
                <Button variant='titleBar' size='headerIcon' onClick={Maximise}
                        title="Maximize"><Maximize2/></Button>
                <Button variant='titleBarDestructive' size='headerIcon' onClick={Close} title="Close"><X/></Button>
            </div>
        </header>
    )
}
