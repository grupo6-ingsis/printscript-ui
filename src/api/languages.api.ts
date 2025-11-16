import apiClient from "./apiClient.ts";
import {FileType} from "../types/FileType.ts";

export async function getSupportedLanguages(): Promise<FileType[]> {
    return apiClient.get('/language/supported');
}