import { object, string, pipe, minLength } from "valibot";

export const projectFormSchema = object({
    name: pipe(string(), minLength(1, "Name is required")),
    repo: pipe(string(), minLength(1, "Repository is required")),
});

export type ProjectFormValues = {
    name: string;
    repo: string;
};
