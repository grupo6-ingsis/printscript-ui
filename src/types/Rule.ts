
export type Rule = {
    id: string,
    name: string,
    isActive: boolean,
    value?: string | null,
    hasValue: boolean,
    valueOptions?: string[],
}

export type LintRuleDto = {
    id: string,
    name: string,
    description: string,
    hasValue: boolean,
    valueOptions: string[],
};

export type LintConfigDto = {
    id: string,
    userId: string,
    lintRule?: LintRuleDto,
    ruleValue?: string,
}

