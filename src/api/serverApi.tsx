export const SERVER_API='http://localhost:8080'

export function getDefaultHeaders(token: string | null){
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
}
