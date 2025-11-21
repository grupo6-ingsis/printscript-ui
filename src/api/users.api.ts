import apiClient from './apiClient';
import { PaginatedUsers, User } from '../utils/users';
import {Auth0User, Auth0UsersResponse} from "../types/UserTypes.ts";

export const searchUsers = async (
    query: string = '',
    page: number = 0,
    pageSize: number = 10,
    snippetId?: string
): Promise<PaginatedUsers> => {
    try {
        const params: Record<string, string> = {
            query: query,
            page: Math.max(page - 1, 0).toString(),
            perPage: Math.min(pageSize, 10).toString(), // 10 porque es lo que pusimos en el backend
        };
        if (snippetId) {
            params.snippetId = snippetId;
        }
        const { data } = await apiClient.get<Auth0UsersResponse>('/users/search', {
            params
        });

        const users: User[] = data.users.map((auth0User) => ({
            id: auth0User.user_id,
            name: auth0User.email || auth0User.name || auth0User.nickname || 'Unknown User',
        }));

        return {
            users,
            page,
            page_size: pageSize,
            count: data.total,
        };
    } catch (error) {
        console.error('Error searching users:', error);
        return {
            users: [],
            page,
            page_size: pageSize,
            count: 0,
        };
    }
};

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const { data } = await apiClient.get<Auth0User>(`/users/${userId}`);
        return {
            id: data.user_id,
            name: data.email || data.name || data.nickname || 'Unknown User',
        };
    } catch (error) {
        console.error('Error fetching user by id:', error);
        return null;
    }
};

export const getUsersByIds = async (userIds: string[]): Promise<Map<string, string>> => {
    const userNamesMap = new Map<string, string>();
    const uniqueIds = [...new Set(userIds)];

    // Hacer todas las llamadas en paralelo
    await Promise.all(
        uniqueIds.map(async (userId) => {
            try {
                const user = await getUserById(userId);
                if (user) {
                    userNamesMap.set(userId, user.name);
                } else {
                    // Si no se encuentra el usuario, usar el ID
                    userNamesMap.set(userId, userId);
                }
            } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
                // En caso de error, usar el ID como fallback
                userNamesMap.set(userId, userId);
            }
        })
    );
    return userNamesMap;
};
