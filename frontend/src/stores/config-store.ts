import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FieldConfig {
    name: string
    type: string
    required: boolean
    readOnly?: boolean
    autoGenerate?: "currentDate" | "currentDateOnUpdate"
    options?: string[]
    fields?: FieldConfig[]
}

interface DataTypeConfig {
    name: string
    displayName: string
    storage: {
        type: string
        path: string
        fileType: string
        parser: string
        variable: string
    }
    schema: {
        type: string
        items: {
            type: string
            fields: FieldConfig[]
        }
    }
}

interface ProjectConfigState {
    configs: Record<string, { dataTypes: DataTypeConfig[] }>
    setConfig: (projectId: string, dataTypes: DataTypeConfig[]) => void
    getConfig: (projectId: string) => { dataTypes: DataTypeConfig[] } | null
}

const mockConfigs: Record<string, { dataTypes: DataTypeConfig[] }> = {
    "lydie/ballet-school-site": {
        dataTypes: [
            {
                name: "BlogPost",
                displayName: "Blog Posts",
                storage: {
                    type: "file",
                    path: "data/blogs.ts", // Changed to .ts
                    fileType: "typescript", // Changed to TypeScript
                    parser: "custom-typescript", // Custom parser for TypeScript
                    variable: "blogsData"
                },
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        fields: [
                            { name: "id", type: "string", required: true, readOnly: true },
                            { name: "title", type: "string", required: true },
                            { name: "content", type: "markdown", required: true },
                            { name: "createdAt", type: "date", required: true, autoGenerate: "currentDate" }
                        ]
                    }
                }
            },
            {
                name: "EventDetail",
                displayName: "Events",
                storage: {
                    type: "file",
                    path: "data/events.ts",
                    fileType: "typescript",
                    parser: "custom-typescript",
                    variable: "eventsData"
                },
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        fields: [
                            { name: "id", type: "string", required: true, readOnly: true },
                            { name: "title", type: "string", required: true },
                            { name: "date", type: "date", required: true }
                        ]
                    }
                }
            }
        ]
    },
    "lydie/dance-events-2025": {
        dataTypes: [
            {
                name: "EventDetail",
                displayName: "Events",
                storage: {
                    type: "file",
                    path: "data/events.json",
                    fileType: "json",
                    parser: "default-json",
                    variable: "eventsData"
                },
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        fields: [
                            { name: "id", type: "string", required: true, readOnly: true },
                            { name: "title", type: "string", required: true },
                            { name: "date", type: "date", required: true }
                        ]
                    }
                }
            }
        ]
    }
}

export const useProjectConfigStore = create<ProjectConfigState>()(
    persist(
        (set, get) => ({
            configs: mockConfigs,
            setConfig: (projectId, dataTypes) => set((state) => ({
                configs: { ...state.configs, [projectId]: { dataTypes } }
            })),
            getConfig: (projectId) => get().configs[projectId] || null,
        }),
        { name: "gitcms-project-configs" }
    )
)