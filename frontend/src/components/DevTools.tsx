import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/stores/project-store"
import { Terminal } from "lucide-react"

export const DevtoolsDropdown = () => {
    const resetStore = useProjectStore((state) => state.reset)

    return (
        <div className="fixed bottom-2 left-40 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="rounded-full">
                        <Terminal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Developer Tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => resetStore()}>
                        🧹 Reset Project Store
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
