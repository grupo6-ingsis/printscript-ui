import apiClient from "./apiClient.ts";
import {LintConfigDto, LintRuleDto} from "../types/Rule.ts";

export async function getLintingRules(): Promise<LintRuleDto[]> {
    const { data } = await apiClient.get(`/lintrule/all`);
    return data;
}

export async function getUserLintingRules(): Promise<LintConfigDto[]> {
    const { data } = await apiClient.get(`/lintconfig/user`);
    return data;
}