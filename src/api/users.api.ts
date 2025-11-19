import apiClient from './apiClient';
import { PaginatedUsers, User } from '../utils/users';
import {Auth0UsersResponse} from "../types/UserTypes.ts";

export const searchUsers = async (
    query: string = '',
    page: number = 0,
    pageSize: number = 10
): Promise<PaginatedUsers> => {
    try {
        const params = {
            query: query,
            page: page.toString(),
            perPage: Math.min(pageSize, 10).toString(), // 10 porque es lo que pusimos en el backend
        };

        const { data } = await apiClient.get<Auth0UsersResponse>('/users/search', {
            params
        });

        const users: User[] = data.users.map((auth0User) => ({
            id: auth0User.user_id,
            name: auth0User.name || auth0User.email || auth0User.nickname || 'Unknown User',
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