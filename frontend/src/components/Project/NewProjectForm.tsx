"use client"

import {useForm} from "react-hook-form"
import {valibotResolver} from "@hookform/resolvers/valibot"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useEffect, useState} from "react"
import {projectFormSchema, ProjectFormValues} from "@/schemas/project-form"
import {GetAvailableRepos} from "../../../wailsjs/go/auth/Binding";

export function NewProjectForm() {
    const form = useForm<ProjectFormValues>({
        resolver: valibotResolver(projectFormSchema),
        defaultValues: {
            name: "",
            repo: "",
        },
    })

    const [repos, setRepos] = useState<string[]>([])


    useEffect(() => {
        const loadRepos = async () => {
            try {
                const repos = await GetAvailableRepos()
                setRepos(repos)
            } catch (err) {
                console.error("Failed to load repos:", err)
            }
        }

        loadRepos()
    }, [])


    const onSubmit = async (values: ProjectFormValues) => {
        alert(values)
        // const [owner, repoName] = values.repo.split("/")
        // const id = `${owner}/${repoName}`
        // const name = values.name
        // const configPath = ".gitcms/config.json"
        //
        // try {
        //     // 1. Add to tracked projects
        //     await AddProject({id, name, owner, repoName, configRef: configPath})
        //
        //     // 2. Create default config
        //     const config = await CreateInitialConfig(id)
        //
        //     // 3. Save it to GitHub
        //     await SaveConfig(id, JSON.stringify(config, null, 2))
        //
        //     // 4. Update local store
        //     useProjectStore.getState().addProject({id, name, owner, repoName, configRef: configPath})
        //
        //     // 5. (optional) redirect or show success
        //     console.log("Project created successfully")
        //
        // } catch (err) {
        //     console.error("Failed to create project:", err)
        // }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 justify-center items-end">
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="repo"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Repository</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a repository"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {repos.map((repo) => (
                                            <SelectItem key={repo} value={repo}>
                                                {repo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">Create Project</Button>
            </form>
        </Form>
    )
}
