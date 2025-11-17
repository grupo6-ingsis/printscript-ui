export type AccessType = "OWNER" | "SHARED" | "ALL";
export type SortByType = 'NAME' | 'LANGUAGE' | 'PASSED_LINT';
export type DirectionType = 'ASC' | 'DESC';

export type SnippetFilters = {
    accessType?: AccessType;
    language?: string;
    passedLint?: boolean;
    sortBy?: SortByType;
    direction?: DirectionType;
}
