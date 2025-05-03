import { createFileRoute } from '@tanstack/react-router'
import {ProjectMenu} from "@/components/Pages/ProjectMenu";

export const Route = createFileRoute('/projects/')({
  component: ProjectMenu,
})

