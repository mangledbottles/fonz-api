export interface IJwt {
    iss: string;
    userId: string;
    sub: string;
    email: string;
    emailVerified: boolean;
} 