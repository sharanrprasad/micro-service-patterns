export interface User {
    id: number;
    email: string;
    name: string;
    status?: "Employed" | "Looking" | "Retired";
    phoneNumbers: string[];
}