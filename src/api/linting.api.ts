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

export async function modifyRule(request: Rule): Promise<LintConfigDto> {
    // Transform the Rule object to match ActivateRuleRequest expected by backend
    const transformedRequest = {
        id: request.id,
        name: request.name,
        isActive: request.isActive,
        hasValue: request.hasValue,
        ruleValue: request.value !== null && request.value !== undefined 
            ? String(request.value) 
            : null
    };
    
    const { data } = await apiClient.post(`/lintconfig`, transformedRequest);
    return data;
}

