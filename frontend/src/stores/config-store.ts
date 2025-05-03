import {model} from "../../wailsjs/go/models";
import DataSource = model.DataSource;
import {create} from "zustand";

interface ProjectConfigState {
    dataTypes: DataSource[]
    setConfig: (dataTypes: DataSource[]) => void
    reset: () => void
}

export const useProjectConfigStore = create<ProjectConfigState>()((set) => ({
    dataTypes: [],
    setConfig: (dataTypes) => set({ dataTypes }),
    reset: () => set({ dataTypes: [] }),
}))