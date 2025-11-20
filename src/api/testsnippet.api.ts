import apiClient from "./apiClient.ts";
import {CreateTestSnippetRequest, TestCase} from "../types/TestCase.ts";

export async function createTestCase(request: CreateTestSnippetRequest): Promise<TestCase> {
    const { data } = await apiClient.post(`/testsnippet`, request);
    return {
        id: data.id,
        name: data.name,
        input: data.input,
        output: data.output,
        snippetId: data.snippetId,
    }
}

export async function deleteTestCase(id: string): Promise<string> {
    const { data } = await apiClient.delete(`/testsnippet/${id}`);
    return data;
}

export async function getTestCases(snippetId: string): Promise<TestCase[]> {
    const { data } = await apiClient.get(`/testsnippet/${snippetId}`);
    return data;
}