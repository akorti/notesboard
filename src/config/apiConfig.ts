export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getUserToken(): string {
    let token = localStorage.getItem('userToken')
    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem('userToken', token)
    }
    return token
}
