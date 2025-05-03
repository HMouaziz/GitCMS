import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {model} from "../../wailsjs/go/models";
import Project = model.Project;



interface ProjectStore {
    projects: Record<string, Project>
    selectedProjectId: string | null
    addProject: (project: model.Project) => void
    removeProject: (id: string) => void
    setSelectedProject: (id: string | null) => void
    getSelectedProject: () => Project | null
    reset: () => void
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            projects: {},
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
                    const {[id]: _, ...rest} = state.projects
                    const isSelected = state.selectedProjectId === id
                    return {
                        projects: rest,
                        selectedProjectId: isSelected ? null : state.selectedProjectId,
                    }
                }),

            setSelectedProject: (id) => {
                const exists = id ? get().projects[id] : true
                if (exists) {
                    set({selectedProjectId: id})
                }
            },

            getSelectedProject: () => {
                const {projects, selectedProjectId} = get()
                return selectedProjectId ? projects[selectedProjectId] ?? null : null
            },

            reset: () => localStorage.removeItem('project-store'),
        }),
        {
            name: 'project-store',
        }
    )
)
