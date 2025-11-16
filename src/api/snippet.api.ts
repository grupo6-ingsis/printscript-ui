import {CreateSnippet, Snippet} from "../utils/snippet.ts";
import apiClient from "./apiClient.ts";

export async function createSnippetFromEditor(input: CreateSnippet): Promise<Snippet> {
    const transformedInput = {
        ...input,
        title: input.name,
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
    return data;
}