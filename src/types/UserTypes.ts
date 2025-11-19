export type Auth0User = {
    user_id: string;
    email: string | null;
    name: string | null;
    nickname: string | null;
    picture: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export type Auth0UsersResponse = {
    users: Auth0User[];
    total: number;
    start: number;
    limit: number;
};