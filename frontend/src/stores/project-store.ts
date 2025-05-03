import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useProjectConfigStore } from "@/stores/config-store"
import {useAuth} from "@/stores/auth-store";
import {LoadConfig} from "../../wailsjs/go/cms/CMS";
import {model} from "../../wailsjs/go/models";

type Project = model.Project

interface ProjectStore {
    projects: Record<string, Project>
    selectedProjectId: string | null
    addProject: (project: Project) => void
    removeProject: (id: string) => void
    setSelectedProject: (id: string) => Promise<void>
    getSelectedProject: () => Project | null
    reset: () => void
}

function getUserStorageKey(): string {
    const username = useAuth.getState().user?.username
    return username ? `gitcms-projects-${username}` : "gitcms-projects"
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            projects: {},
            selectedProjectId: null,
            addProject: (project) =>
                set((state) => ({
                    projects: { ...state.projects, [project.id]: project },
                })),
            removeProject: (id) =>
                set((state) => {
                    const { [id]: _, ...rest } = state.projects
                    return {
                        projects: rest,
                        selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
                    }
                }),
            setSelectedProject: async (id) => {
                const exists = id ? get().projects[id] : false
                if (!exists) throw new Error("Project not found")
                set({ selectedProjectId: id })

                const config = await LoadConfig(id)
                useProjectConfigStore.getState().setConfig(config.content)
            },
            getSelectedProject: () => {
                const { selectedProjectId, projects } = get()
                return selectedProjectId ? projects[selectedProjectId] ?? null : null
            },
            reset: () => {
                const key = getUserStorageKey()
                localStorage.removeItem(key)
                set({ projects: {}, selectedProjectId: null })
            },
        }),
        {
            name: getUserStorageKey(),
        }
    )
)
