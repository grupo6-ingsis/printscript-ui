import apiClient from "./apiClient.ts";
import {FileType, LanguageVersionDto} from "../types/FileType.ts";

export async function getSupportedLanguages(): Promise<FileType[]> {
    const {data} = await apiClient.get('/language/supported');
    return data;
}

export async function getSupportedLanguageVersions(languageName: string): Promise<LanguageVersionDto> {
    const { data } = await apiClient.get(`/language-version/supported`, {
        params: { languageName },
    });
    return data;
}