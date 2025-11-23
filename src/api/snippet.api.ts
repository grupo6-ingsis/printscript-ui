import {
    ComplianceEnum,
    CreateSnippet, ShareSnippetResponseDto,
    Snippet,
    SnippetApiResponse,
    SnippetContentDto,
    SnippetFilters
} from "../utils/snippet.ts";
import apiClient from "./apiClient.ts";
import {getUsersByIds} from "./users.api.ts";
import {InterpretSnippetRequest, InterpretSnippetResponse} from "../types/InterpretSnippet.ts";

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

export async function getSnippetsPaginated(
    page: number, 
    pageSize: number, 
    snippetName?: string,
    filters?: SnippetFilters
) {
    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(snippetName && { name: snippetName }),
        ...(filters?.accessType && { accessType: filters.accessType }),
        ...(filters?.language && { language: filters.language }),
        ...(filters?.passedLint !== undefined && { passedLint: filters.passedLint.toString() }),
        ...(filters?.sortBy && { sortBy: filters.sortBy }),
        ...(filters?.direction && { direction: filters.direction }),
    });
    const { data } = await apiClient.get(`/snippets/paginated?${params.toString()}`);

    // Batch fetch users names
    const userIds = data.content.map((snippet: SnippetApiResponse) => snippet.ownerId);
    const userNamesMap = await getUsersByIds(userIds);

    const snippets: Snippet[] = data.content.map((snippet: SnippetApiResponse) => ({
        id: snippet.id,
        name: snippet.title,
        content: "",
        language: snippet.languageVersion.language.name,
        extension: snippet.languageVersion.language.extension,
        version: snippet.languageVersion.version,
        description: snippet.description,
        compliance: snippet.compliance,
        author: userNamesMap.get(snippet.ownerId) || snippet.ownerId
    }));

    return {
        snippets,
        page: data.number,
        page_size: data.size,
        count: data.totalElements,
    };
}

export async function getSnippetById(snippetId: string): Promise<SnippetContentDto> {
    const { data } = await apiClient.get(`/snippets/${snippetId}`);
    return data;
}

export async function updateSnippetContent(snippetId: string, content: string): Promise<Snippet> {
    const {data} = await apiClient.put(`/snippets/${snippetId}`, {content});
    return {
        id: data.id,
        name: data.title,
        content: data.content,
        language: "",
        extension: "",
        version: data.version,
        description: data.description,
        compliance: "PENDING",
        author: "",
    }
}

export async function deleteSnippetById(snippetId: string): Promise<void> {
    await apiClient.delete(`/snippets/${snippetId}`);
}

export async function shareSnippetWithUser(snippetId: string, userId: string): Promise<Snippet> {
    const { data } = await apiClient.patch(`snippets/share/${snippetId}/${userId}`);
    return mapShareSnippetResponseToSnippet(data)
}

export function mapShareSnippetResponseToSnippet(response: ShareSnippetResponseDto): Snippet {
    return {
        id: response.snippetId,
        name: "",
        content: "",
        language: "",
        extension: "",
        version: "",
        description: "",
        compliance: "PENDING" as ComplianceEnum,
        author: response.userId,
    }
}

export async function interpretSnippet(input: InterpretSnippetRequest, snippetId: string): Promise<InterpretSnippetResponse> {
    const { data } = await apiClient.post(`/interpret/${snippetId}`, input)
    return data;
}
