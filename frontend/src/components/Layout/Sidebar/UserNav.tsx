"use client"

import {BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles,} from "lucide-react"

import {Avatar, AvatarFallback, AvatarImage,} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {Skeleton} from "@/components/ui/skeleton";
import {useAuth} from "@/stores/auth-store";
import {useNavigate} from "@tanstack/react-router";
import {auth} from "../../../../wailsjs/go/models";
import UserDetails = auth.UserDetails;


export function NavUser({user}: { user: UserDetails | null }) {
    const {isMobile} = useSidebar()
    const logout = useAuth((state) => state.logout)
    const navigate = useNavigate()
    const isLoading = !user
    const fullName = [user?.name, user?.lastName].filter(Boolean).join(" ")
    const initials = fullName
        .match(/\b\w/g)
        ?.slice(0, 2)
        .join("")
        .toUpperCase() ?? "?"

    function handleLogout() {
        logout()
        navigate({to: '/app/login'})
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {isLoading ? (
                                    <Skeleton className="h-8 w-8 rounded-lg"/>
                                ) : (
                                    <>
                                        <AvatarImage src={user.avatarUrl} alt={user.username}/>
                                        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                                    </>
                                )}
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-4 w-24 mb-1"/>
                                        <Skeleton className="h-3 w-32"/>
                                    </>
                                ) : (<>
                                        <span className="truncate font-semibold">
                                            {user.name && user.lastName
                                                ? `${user.name} ${user.lastName}`
                                                : user.username}
                                        </span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </>
                                )}
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-8 rounded-lg"/>
                                    ) : (
                                        <>
                                            <AvatarImage src={user.avatarUrl} alt={user.username}/>
                                            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="h-4 w-24 mb-1"/>
                                            <Skeleton className="h-3 w-32"/>
                                        </>
                                    ) : (<>
                                            <span className="truncate font-semibold">
                                                {user.name && user.lastName
                                                    ? `${user.name} ${user.lastName}`
                                                    : user.username}
                                            </span>
                                            <span className="truncate text-xs">{user.email}</span>
                                        </>
                                    )}
                                </div>

                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles/>
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck/>
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCard/>
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell/>
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
