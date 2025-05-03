import * as React from 'react'
import {createRootRoute, Outlet} from '@tanstack/react-router'
import {NotFound} from "@/components/Pages/NotFound";
import {TitleBar} from "@/components/TitleBar/TitleBar";
import {DevtoolsDropdown} from "@/components/DevTools";
import {useAuth} from "@/stores/auth-store";
import {GetUser, IsAuthed} from "../../wailsjs/go/auth/Binding";

export const Route = createRootRoute({
    beforeLoad: async () => {
        const ok = await IsAuthed()
        if (ok) {
            const user = await GetUser()
            useAuth.setState({ isAuthed: true, user })
        } else {
            useAuth.setState({ isAuthed: false, user: null })
        }
    },
    notFoundComponent: () => <NotFound/>,
    component: RootComponent,
})

function RootComponent() {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <TitleBar/>
            <div className="pt-10 h-full overflow-hidden">
                <div className="h-full overflow-auto">
                    <Outlet/>
                </div>
            </div>
            <DevtoolsDropdown/>
        </div>
    )
}

