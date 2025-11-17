import apiClient from "./apiClient.ts";
import {LintConfigDto, LintRuleDto, Rule} from "../types/Rule.ts";

export async function getLintingRules(): Promise<LintRuleDto[]> {
    const { data } = await apiClient.get(`/lintrule/all`);
    return data;
}

export async function getUserLintingRules(): Promise<LintConfigDto[]> {
    const { data } = await apiClient.get(`/lintconfig/user`);
    return data;
}

export async function activateRule(request : Rule): Promise<LintConfigDto>{
    const { data } = await apiClient.post(`/lintconfig`, request);
    return data;
}

export async function deactivateRule(lintRuleId: string): Promise<void>{
    await apiClient.delete(`/lintconfig`, {
        params: { lintRuleId }
    });
}
