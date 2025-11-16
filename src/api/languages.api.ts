import apiClient from "./apiClient.ts";
import {FileType} from "../types/FileType.ts";

export async function getSupportedLanguages(): Promise<FileType[]> {
    console.log('Fetching supported languages from API');
    console.log(apiClient.getUri());
    return apiClient.get('/language/supported');
}