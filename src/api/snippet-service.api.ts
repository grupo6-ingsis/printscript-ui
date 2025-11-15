import {CreateSnippet, Snippet} from "../utils/snippet.ts";
import apiClient from "./apiClient.ts";

export async function createSnippetFromEditor(input: CreateSnippet): Promise<Snippet> {
    const { data } = await apiClient.post('/snippets/create', input);
    return data
}