import React from 'react'
import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {routeTree} from './routeTree.gen'
import {queryClient} from "@/lib/queryClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {useThemeStore} from "@/stores/theme-store";
import "./style.css"
import {DevtoolsDropdown} from "@/components/DevTools";

const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const theme = localStorage.getItem('gitcms-theme')
if (theme) {
    useThemeStore.getState().setTheme(JSON.parse(theme).state.theme)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
            {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
            {/*<DevtoolsDropdown/>*/}
        </QueryClientProvider>
    </React.StrictMode>
)
