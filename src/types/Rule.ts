
export type Rule = {
    id: string,
    name: string,
    isActive: boolean,
    value?: string | number | null,
    hasValue: boolean,
}

export type LintRuleDto = {
    id: string,
    name: string,
    description: string,
    hasValue: boolean,
};

export type LintConfigDto = {
    id: string,
    userId: string,
    rules?: LintRuleDto,
    ruleValue?: string,
}

