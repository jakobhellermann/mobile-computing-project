import { getAuthToken } from "../modules/auth/AuthProvider";

export const BASE_URL = "http://localhost:3000/api";
//export const BASE_URL = "http://192.168.178.21:3000/api";

export async function apiFetchUnauthorized<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    if (!path.startsWith("/")) throw new Error(`'${path} should start with '/'`);

    let res = await fetch(`${BASE_URL}${path}`, init);

    if (!res.ok) {
        let data: { message: string; error: string; } = await res.json();
        throw new Error(`failed to fetch ${path}: ${data.message}`, { cause: res });
    } {
        if (res.headers.get("content-type")?.toLowerCase().includes("application/json")) {
            return await res.json();
        }
        // TODO: make this less ugly
        return null as T;
    }
}

export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    let token = await getAuthToken();
    init = {
        ...init,
        headers: {
            "Authorization": `Bearer ${token}`,
            ...init?.headers,
        }
    };
    return await apiFetchUnauthorized(path, init);
}