import apiClient from "./apiClient.ts";
import {CreateTestSnippetRequest, TestCase} from "../types/TestCase.ts";
import {TestCaseResult} from "../utils/queries.tsx";

export async function createTestCase(request: CreateTestSnippetRequest): Promise<TestCase> {
    const { data } = await apiClient.post(`/testsnippet`, request);
    return {
        id: data.id,
        name: data.name,
        input: data.input,
        output: data.expectedOutput,
        snippetId: data.snippetId,
    }
}

export async function deleteTestCase(id: string): Promise<string> {
    const { data } = await apiClient.delete(`/testsnippet/${id}`);
    return data;
}

export async function getTestCases(snippetId: string): Promise<TestCase[]> {
    const { data } = await apiClient.get(`/testsnippet`, { params: { snippetId } });
    return data;
}

export async function runTestSnippet(test: CreateTestSnippetRequest): Promise<TestCaseResult> {
    const { data } = await apiClient.post(`/testsnippet/run`, test);
    return data.resultType;
}

