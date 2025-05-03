import {
    FileText,
    Code2,
    Database,
    LayoutTemplate,
    Folder,
    Terminal,
    Settings,
} from "lucide-react"
import type { ElementType } from "react"
import {model} from "../../wailsjs/go/models";
import Config = model.Config;
import DataSource = model.DataSource;

const formatToIconMap: Record<string, ElementType> = {
    markdown: FileText,
    json: Code2,
    csv: Database,
    yaml: LayoutTemplate,
    toml: Settings,
    ts: Terminal,
    js: Terminal,
}

export function getProjectIcon(config?: Config): ElementType {
    if (!config || !Array.isArray(config.content)) return Folder

    const matching = config.content.find((entry: DataSource) =>
        formatToIconMap[entry.format?.toLowerCase?.()]
    )

    return formatToIconMap[matching?.format?.toLowerCase?.() ?? ""] ?? Folder
}
