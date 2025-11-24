export type InterpretSnippetRequest = {
    snippetContent: string,
    version: string,
    inputs: string[],
}

export type InterpretSnippetResponse = {
    results: string[],
    resultType:'SUCCESS' | 'FAILURE',
}