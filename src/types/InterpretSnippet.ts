export type InterpretSnippetRequest = {
    snippetContent: string,
    version: string,
    inputs: string[],
}

export type InterpretSnippetResponse = {
    outputs: string[],
    resultType:'SUCCESS' | 'FAILURE',
}