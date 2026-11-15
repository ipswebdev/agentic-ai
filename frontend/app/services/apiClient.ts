
import { clearLocalStorage, getLocalStorage } from "./session.service";

const getHeaders = (headers = {}) => {
    const authData = getLocalStorage("userDetails");

    return {
        ...(authData?.jwt
            ? { Authorization: `Bearer ${authData.jwt}` }
            : {}),
        ...headers,
    };
};

const handleResponse = (response: Response) => {
    if (response.status === 401) {
        clearLocalStorage();
        return null;
    }

    return response;
};

export const get = async (
    url: string,
    headers: Record<string, string> = {}
) => {
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(headers),
    });

    return handleResponse(response);
};

export const post = async (
    url: string,
    headers: Record<string, string> = {},
    body?: BodyInit
) => {
    const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(headers),
        ...(body !== undefined ? { body } : {}),
    });

    return handleResponse(response);
};

export const deleteReq = async (
    url: string,
    headers: Record<string, string> = {},
    body?: BodyInit
) => {
    const response = await fetch(url, {
        method: "DELETE",
        headers: getHeaders(headers),
        ...(body !== undefined ? { body } : {}),
    });

    return handleResponse(response);
};
