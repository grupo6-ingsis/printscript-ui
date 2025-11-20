export type TestCase = {
    id: string;
    name: string;
    input?: string[];
    output?: string[];
    snippetId: string;
};

export type CreateTestSnippetRequest = {
    id: string;
    name: string;
    input?: string[];
    output?: string[];
    snippetId: string;
};