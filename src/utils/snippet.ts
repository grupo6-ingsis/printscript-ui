import {Pagination} from "./pagination.ts";
import {FileType} from "../types/FileType.ts";
import {AccessType, DirectionType, SortByType} from "../types/FilterTypes.ts";

export type ComplianceEnum =
    'PENDING' |
    'FAILED' |
    'NOT_COMPLIANT' |
    'COMPLIANT'


export type CreateSnippet = {
    name: string;
    content: string;
    language: string;
    extension: string;
    version: string; // Add this property
    description: string;
};


export type CreateSnippetWithLang = CreateSnippet & { language: string }

export type UpdateSnippet = {
  content: string
}

export type Snippet = CreateSnippet & {
  id: string
} & SnippetStatus

type SnippetStatus = {
  compliance: ComplianceEnum;
  author: string;
}
export type PaginatedSnippets = Pagination & {
  snippets: Snippet[]
}

export const getFileLanguage = (fileTypes: FileType[], fileExt?: string) => {
  return fileExt && fileTypes?.find(x => x.extension == fileExt)
}

export type SnippetApiResponse ={
    id: string;
    title: string;
    description: string;
    ownerId: string;
    languageVersion: {
        version: string;
        language: {
            name: string;
            extension: string;
        };
    };
    complianceType: ComplianceEnum;
}

export type SnippetContentDto = {
    snippet: SnippetApiResponse
    content: string;
}

export type SnippetFilters = {
    accessType?: AccessType;
    language?: string;
    passedLint?: boolean;
    sortBy?: SortByType;
    direction?: DirectionType;
}