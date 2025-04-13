import * as React from 'react'
import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {NotFound} from "@/components/Pages/NotFound";
import {TitleBar} from "@/components/TitleBar/TitleBar";

export const Route = createRootRoute({
    notFoundComponent: () => <NotFound/>,
    component: RootComponent,
})

function RootComponent() {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <TitleBar/>
            <main className="flex-1 overflow-auto">
                <Outlet/>
            </main>
            <TanStackRouterDevtools/>
        </div>
    )
}
