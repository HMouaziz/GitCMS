import * as React from 'react'
import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {NotFound} from "@/components/Pages/NotFound";

export const Route = createRootRoute({
    notFoundComponent: () => <NotFound/>,
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <Outlet/>
            <TanStackRouterDevtools/>
        </React.Fragment>
    )
}
