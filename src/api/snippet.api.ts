import {CreateSnippet, Snippet, SnippetApiResponse} from "../utils/snippet.ts";
import apiClient from "./apiClient.ts";

export async function createSnippetFromEditor(input: CreateSnippet): Promise<Snippet> {
    const transformedInput = {
        title: input.name,
        description: input.description,
        language: input.language,
        content: input.content,
        version: input.version,
    };

    const { data } = await apiClient.post('/snippets', transformedInput);
    return data
}

export async function getSnippetsPaginated(page: number, pageSize: number, snippetName?: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(snippetName && { name: snippetName })
    });

    const { data } = await apiClient.get(`/snippets/paginated?${params.toString()}`);


    const snippets: Snippet[] = data.content.map((snippet: SnippetApiResponse) => ({
        id: snippet.id,
        name: snippet.title,
        content: "",
        language: snippet.languageVersion.language.name,
        extension: snippet.languageVersion.language.extension,
        version: snippet.languageVersion.version,
        description: snippet.description,
        compliance: "pending",
        author: snippet.ownerId,
    }));

    return {
        snippets,
        page: data.number,
        page_size: data.size,
        count: data.totalElements,
    };
}

