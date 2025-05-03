"use client"

import * as React from "react"
import {ChevronsUpDown, Plus} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import { useProjectStore} from "@/stores/project-store";
import {Skeleton} from "@/components/ui/skeleton";
import {model} from "../../../../wailsjs/go/models";
import Project = model.Project;
import {getProjectIcon} from "@/lib/project-icon";

export function ProjectNav({projects}: { projects: Project[] }) {
    const {isMobile} = useSidebar()
    const activeProject = useProjectStore(state => state.getSelectedProject())
    const setSelectedProject = useProjectStore(state => state.setSelectedProject)
    const Icon = getProjectIcon(activeProject?.config)


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {Icon ? <Icon className="size-4" /> : <Skeleton className="size-4" />}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeProject ? activeProject.name : 'Select a Project'}
                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Projects
                        </DropdownMenuLabel>
                        {projects.map((project, index) => {
                           const Icon = getProjectIcon(project.config)

                            return (
                                <DropdownMenuItem
                                    key={project.id}
                                    onClick={() => setSelectedProject(project.id)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        {Icon ? <Icon className="size-4 shrink-0" /> : <Skeleton className="size-4" />}
                                    </div>
                                    {project.name}
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            )
                        })}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4"/>
                            </div>
                            <div className="font-medium text-muted-foreground">Add project</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
