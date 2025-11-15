import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://snippet-searcher-app-dev.duckdns.org/service",
    headers: {
        'Content-Type': 'application/json',
    },
});

let getAccessToken: (() => Promise<string>) | null = null;

export const setTokenGetter = (getter: () => Promise<string>) => {
    getAccessToken = getter;
};

apiClient.interceptors.request.use(
    async (config) => {
        if (getAccessToken) {
            try {
                const token = await getAccessToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Failed to get access token', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
