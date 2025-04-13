import logo from "@/assets/images/appicon.png"
import {cn} from "@/lib/utils";

export const Logo = ({className}: {className?: string} ) => {
    return <img src={logo} alt="GitCMS" className={cn("size-8", className)}/>
}