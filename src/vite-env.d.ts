/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_API_NAME: string
    readonly VITE_APP_SECRET_KEY: string
    readonly VITE_APP_TOKEN_CHARSET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
