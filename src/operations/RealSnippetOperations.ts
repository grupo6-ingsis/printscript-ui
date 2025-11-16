import {SnippetOperations} from '../utils/snippetOperations'
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from '../utils/snippet'
import {PaginatedUsers} from "../utils/users";
import {TestCase} from "../types/TestCase";
import {TestCaseResult} from "../utils/queries";
import {FileType} from "../types/FileType";
import {Rule} from "../types/Rule";
import {createSnippetFromEditor, getSnippetsPaginated} from "../api/snippet.api.ts";
import {setTokenGetter} from "../api/apiClient.ts";
import {getSupportedLanguages} from "../api/languages.api.ts";

export class RealSnippetOperations implements SnippetOperations {
    constructor(getAccessTokenSilently: () => Promise<string>) {
        setTokenGetter(getAccessTokenSilently);
    }
    async listSnippetDescriptors(_page: number, _pageSize: number, _snippetName?: string): Promise<PaginatedSnippets> {
        return await getSnippetsPaginated(_page, _pageSize, _snippetName);
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        return await createSnippetFromEditor(createSnippet);
    }

    async getSnippetById(_id: string): Promise<Snippet | undefined> {
        throw new Error('Not implemented');
    }

    async updateSnippetById(_id: string, _updateSnippet: UpdateSnippet): Promise<Snippet> {
        throw new Error('Not implemented');
    }

    async getUserFriends(_name?: string, _page?: number, _pageSize?: number): Promise<PaginatedUsers> {
        throw new Error('Not implemented');
    }

    async shareSnippet(_snippetId: string, _userId: string): Promise<Snippet> {
        throw new Error('Not implemented');
    }

    async getFormatRules(): Promise<Rule[]> {
        throw new Error('Not implemented');
    }

    async getLintingRules(): Promise<Rule[]> {
        throw new Error('Not implemented');
    }

    async getTestCases(): Promise<TestCase[]> {
        throw new Error('Not implemented');
    }

    async formatSnippet(_snippet: string): Promise<string> {
        throw new Error('Not implemented');
    }

    async postTestCase(_testCase: Partial<TestCase>): Promise<TestCase> {
        throw new Error('Not implemented');
    }

    async removeTestCase(_id: string): Promise<string> {
        throw new Error('Not implemented');
    }

    async deleteSnippet(_id: string): Promise<string> {
        throw new Error('Not implemented');
    }

    async testSnippet(_testCase: Partial<TestCase>): Promise<TestCaseResult> {
        throw new Error('Not implemented');
    }

    async getFileTypes(): Promise<FileType[]> {
        return await getSupportedLanguages();


    }

    async modifyFormatRule(_newRules: Rule[]): Promise<Rule[]> {
        throw new Error('Not implemented');
    }

    async modifyLintingRule(_newRules: Rule[]): Promise<Rule[]> {
        throw new Error('Not implemented');
    }
}
