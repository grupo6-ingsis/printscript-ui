
export type Rule = {
    id: string,
    name: string,
    isActive: boolean,
    value?: string | number | null,
}

export type LintRuleDto = {
    id: string,
    name: string,
    description: string,
};

export type LintConfigDto = {
    id: string,
    userId: string,
    rules?: LintRuleDto,
    ruleValue?: string,
}

