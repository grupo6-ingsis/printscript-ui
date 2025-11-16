import apiClient from "./apiClient.ts";
import {FileType} from "../types/FileType.ts";

export async function getSupportedLanguages(): Promise<FileType[]> {
    const {data} = await apiClient.get('/language/supported');
    return data;
}