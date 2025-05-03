import * as React from 'react'
import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {NotFound} from "@/components/Pages/NotFound";
import {TitleBar} from "@/components/TitleBar/TitleBar";
import {DevtoolsDropdown} from "@/components/DevTools";

export const Route = createRootRoute({
    notFoundComponent: () => <NotFound/>,
    component: RootComponent,
})

function RootComponent() {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <TitleBar/>
            <div className="pt-[40px] h-[calc(100vh-40px)]">
                <Outlet/>
            </div>
            {/*<TanStackRouterDevtools/>*/}
            <DevtoolsDropdown/>
        </div>
    )
}
