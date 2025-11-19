import apiClient from "./apiClient.ts";
import {FormatConfigDto, FormatRuleDto, Rule} from "../types/Rule.ts";

export async function getFormattingRules(): Promise<FormatRuleDto[]> {
    const { data } = await apiClient.get(`/formatrule/all`);
    return data;
}

export async function getUserFormattingRules(): Promise<FormatConfigDto[]> {
    const { data } = await apiClient.get(`/formatconfig/user`);
    return data;
}

export async function modifyFormattingRule(request: Rule): Promise<FormatConfigDto | null> {
    // Transform the Rule object to match ActivateFormatRuleRequest expected by backend
    const transformedRequest = {
        id: request.id,
        name: request.name,
        isActive: request.isActive,
        hasValue: request.hasValue,
        ruleValue: request.value !== null && request.value !== undefined
            ? Number(request.value)
            : null
    };

    const response = await apiClient.post(`/formatconfig`, transformedRequest);

    // Handle 204 No Content response (when deactivating)
    if (response.status === 204) {
        return null;
    }

    return response.data;
}