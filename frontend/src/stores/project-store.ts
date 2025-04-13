import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
    id: string
    name: string
    owner: string
}

interface ProjectStore {
    projects: Record<string, Project>
    selectedProjectId: string | null
    addProject: (project: Project) => void
    removeProject: (id: string) => void
    setSelectedProject: (id: string | null) => void
    getSelectedProject: () => Project | null
    reset: () => void
}

const mockProjects: Record<string, Project> = {
    "lydie/ballet-school-site": {
        id: "lydie/ballet-school-site",
        name: "ballet-school-site",
        owner: "lydie"
    },
    "lydie/dance-events-2025": {
        id: "lydie/dance-events-2025",
        name: "dance-events-2025",
        owner: "lydie"
    },
    "lydie/dance-events-2024": {
        id: "lydie/dance-events-2024",
        name: "dance-events-2024",
        owner: "lydie"
    },
    "lydie/dance-events-2023": {
        id: "lydie/dance-events-2023",
        name: "dance-events-2023",
        owner: "lydie"
    }
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            projects: mockProjects,
            selectedProjectId: null,

            addProject: (project) =>
                set((state) => ({
                    projects: {
                        ...state.projects,
                        [project.id]: project,
                    },
                })),

            removeProject: (id) =>
                set((state) => {
                    const { [id]: _, ...rest } = state.projects
                    const isSelected = state.selectedProjectId === id
                    return {
                        projects: rest,
                        selectedProjectId: isSelected ? null : state.selectedProjectId,
                    }
                }),

            setSelectedProject: (id) => {
                const exists = id ? get().projects[id] : true
                if (exists) {
                    set({ selectedProjectId: id })
                }
            },

            getSelectedProject: () => {
                const { projects, selectedProjectId } = get()
                return selectedProjectId ? projects[selectedProjectId] ?? null : null
            },

            reset: () => localStorage.removeItem('project-store'),
        }),
        {
            name: 'project-store',
        }
    )
)
