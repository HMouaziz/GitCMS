import {createFileRoute, Outlet} from '@tanstack/react-router'
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/Layout/Sidebar/AppSidebar";

export const Route = createFileRoute('/projects/$projectId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <>
        <SidebarProvider defaultOpen>
            <AppSidebar/>
            <main>
                <SidebarTrigger/>
                <Outlet/>
            </main>
        </SidebarProvider>
    </>
}
