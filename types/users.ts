export interface User {
    id?: string
    name: string
    email: string
    password: string
    location: string
    phone?: string
    createdAt?: Date
    profilePicture?: string
}