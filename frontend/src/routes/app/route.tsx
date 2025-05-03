import {createFileRoute, Outlet} from "@tanstack/react-router";

export const Route = createFileRoute('/app')({
    component: AppLayout,
})

function AppLayout() {
    return (
        <div className="h-full w-full overflow-auto bg-background text-foreground">
            <Outlet/>
        </div>
    )
}
