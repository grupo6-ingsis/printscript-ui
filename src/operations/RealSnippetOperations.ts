import {SnippetFilters, SnippetOperations} from '../utils/snippetOperations'
import {CreateSnippet, PaginatedSnippets, Snippet, SnippetContentDto, UpdateSnippet} from '../utils/snippet'
import {PaginatedUsers} from "../utils/users";
import {TestCase} from "../types/TestCase";
import {TestCaseResult} from "../utils/queries";
import {FileType, LanguageVersionDto} from "../types/FileType";
import {FormatConfigDto, FormatRuleDto, LintConfigDto, LintRuleDto, Rule} from "../types/Rule";
import {
    createSnippetFromEditor, deleteSnippetById,
    getSnippetById,
    getSnippetsPaginated, shareSnippetWithUser,
    updateSnippetContent
} from "../api/snippet.api.ts";
import {setTokenGetter} from "../api/apiClient.ts";
import {getSupportedLanguages, getSupportedLanguageVersions} from "../api/languages.api.ts";
import {getLintingRules, getUserLintingRules, modifyRule} from "../api/linting.api.ts";
import { searchUsers } from '../api/users.api.ts';
import {getFormattingRules, getUserFormattingRules} from "../api/formatting.api.ts";

export class RealSnippetOperations implements SnippetOperations {
    constructor(getAccessTokenSilently: () => Promise<string>) {
        setTokenGetter(getAccessTokenSilently);
    }
    async listSnippetDescriptors(_page: number, _pageSize: number, _snippetName?: string, _filters?: SnippetFilters): Promise<PaginatedSnippets> {
        return await getSnippetsPaginated(_page, _pageSize, _snippetName, _filters);
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        return await createSnippetFromEditor(createSnippet);
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const data: SnippetContentDto = await getSnippetById(id);
        if (!data) {
            return undefined;
        }
        return {
            id: data.snippet.id,
            name: data.snippet.title,
            content: data.content,
            language: data.snippet.languageVersion.language.name,
            extension: data.snippet.languageVersion.language.extension,
            version: data.snippet.languageVersion.version,
            description: data.snippet.description,
            compliance: data.snippet.compliance,
            author: data.snippet.ownerId,
        };
    }


    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        return await updateSnippetContent(id, updateSnippet.content)
    }

    async getUserFriends(_name?: string, _page?: number, _pageSize?: number): Promise<PaginatedUsers> {
        return await searchUsers(_name || '', _page || 0, _pageSize || 10);
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        return await shareSnippetWithUser(snippetId, userId);
    }
    async getFormatRules(): Promise<Rule[]> {
        const allRules: FormatRuleDto[] = await getFormattingRules();
        const userActiveRules: FormatConfigDto[] = await getUserFormattingRules();

        return allRules.map(rule => {
            const activeRule = userActiveRules.find(userRule => userRule.formatRule?.id === rule.id);
            return {
                id: rule.id,
                name: rule.name,
                isActive: !!activeRule,
                value: activeRule?.ruleValue !== undefined && activeRule?.ruleValue !== null
                    ? String(activeRule.ruleValue)
                    : null,
                hasValue: rule.hasValue,
                valueOptions: rule.valueOptions ? rule.valueOptions.map(opt => String(opt)) : [],
            };
        });
    }


    async getLintingRules(): Promise<Rule[]> {
        const allRules: LintRuleDto[] = await getLintingRules();
        const userActiveRules: LintConfigDto[] = await getUserLintingRules();

        return allRules.map(rule => {
            const activeRule = userActiveRules.find(userRule => userRule.lintRule?.id === rule.id);
            return {
                id: rule.id,
                name: rule.name,
                isActive: !!activeRule,
                value: activeRule?.ruleValue ?? null,
                hasValue: rule.hasValue,
                valueOptions: rule.valueOptions || [],
            };
        });
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
        await deleteSnippetById(_id);
        return _id;
    }

    async testSnippet(_testCase: Partial<TestCase>): Promise<TestCaseResult> {
        throw new Error('Not implemented');
    }

    async getFileTypes(): Promise<FileType[]> {
        return await getSupportedLanguages();
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        const userActiveRules: FormatConfigDto[] = await getUserFormattingRules();
        for (const rule of newRules) {
            const wasActive = userActiveRules.find(r => r.formatRule?.id === rule.id);

            // Activate - only if not active before
            if (rule.isActive && !wasActive) {
                await modifyRule(rule);
            }
            // Deactivate - only if was active before
            else if (!rule.isActive && wasActive) {
                await modifyRule({ ...rule, isActive: false });
            }
            // Update value - only if active and value changed
            else if (rule.isActive && wasActive && rule.value !== wasActive.ruleValue) {
                await modifyRule(rule);
            }
            // If no changes, skip
        }
        return this.getFormatRules();

    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        const userActiveRules: LintConfigDto[] = await getUserLintingRules();

        for (const rule of newRules) {
            const wasActive = userActiveRules.find(r => r.lintRule?.id === rule.id);

            // Activate - only if not active before
            if (rule.isActive && !wasActive) {
                await modifyRule(rule);
            }
            // Deactivate - only if was active before
            else if (!rule.isActive && wasActive) {
                await modifyRule({ ...rule, isActive: false });
            }
            // Update value - only if active and value changed
            else if (rule.isActive && wasActive && rule.value !== wasActive.ruleValue) {
                await modifyRule(rule);
            }
            // If no changes, skip
        }
        return this.getLintingRules();
    }



    async getSupportedLanguageVersions(languageName: string): Promise<LanguageVersionDto> {
        return await getSupportedLanguageVersions(languageName);
    }
}
