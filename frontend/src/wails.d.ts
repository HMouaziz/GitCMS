declare global {
    interface Window {
        backend: {
            GitHandler: {
                CloneRepo: (url: string, path: string) => Promise<void>;
                CommitAndPush: (path: string, message: string, username: string, email: string) => Promise<void>;
                EditFile: (filePath: string, content: string) => Promise<void>;
            };
        };
    }
}

export {};
