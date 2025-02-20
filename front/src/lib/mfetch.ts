import { getEndpoint } from "./getEndpoint";

export const mfetch = async (
    input: RequestInfo | URL,
    init?: RequestInit)
        : Promise<Response> =>
{
    const password = localStorage.getItem('password');

    return fetch(`${getEndpoint()}${input}`, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: `sexe ${password || ''}`
        }
    })
}