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

export async function modifyLintRule(request: Rule): Promise<LintConfigDto | null> {
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
    
    const response = await apiClient.post(`/lintconfig`, transformedRequest);
    
    // Handle 204 No Content response (when deactivating)
    if (response.status === 204) {
        return null;
    }
    
    return response.data;
}

