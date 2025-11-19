
export type Rule = {
    id: string,
    name: string,
    isActive: boolean,
    value?: string | number | null ,
    hasValue: boolean,
    valueOptions?: string[] | number[],
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

export type FormatRuleDto = {
    id: string,
    name: string,
    description: string,
    hasValue: boolean,
    valueOptions: number[],
}

export type FormatConfigDto = {
    id: string,
    userId: string,
    formatRule?: FormatRuleDto,
    ruleValue?: number,
}