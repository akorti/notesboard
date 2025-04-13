export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getUserToken(): Promise<string> {
    const pathParts = window.location.pathname.split('/')
    const urlToken = pathParts[1]?.trim()
    console.log(urlToken)
    const isValidToken = (token: string) =>
        /^[A-Za-z0-9_-]{6,32}$/.test(token)

    if (urlToken && isValidToken(urlToken)) {
        console.log('Token from URL:', urlToken)
        localStorage.setItem('userToken', urlToken)
        return urlToken
    }

    const token = localStorage.getItem('userToken')
    if (token && isValidToken(token)) {
        console.log(token)
        return token
    }

    try {
        const res = await fetch(`${API_BASE_URL}/generate-short-token`, {
            headers: {
                'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
            }
        })
        const data = await res.json()

        if (typeof data?.shortToken === 'string' && isValidToken(data.shortToken)) {
            const token = data.shortToken
            localStorage.setItem('userToken', token)
            return token
        } else {
            throw new Error('Invalid token format from server')
        }
    } catch (error) {
        console.error('❌ Failed to fetch short token from server:', error)
        throw new Error('Unable to generate or retrieve user token')
    }
}

export async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await getUserToken()
    return {
        'x-user-token': token,
        'x-app-key': import.meta.env.VITE_APP_SECRET_KEY,
        'Content-Type': 'application/json',
    }
}
