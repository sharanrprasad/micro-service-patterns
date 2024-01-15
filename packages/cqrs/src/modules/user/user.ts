export interface UserQueryDto {
    id: number;
    email: string;
    name: string;
    status?: "Employed" | "Looking" | "Retired";
}

// Creating different models as that is how it is usually in CQRS patterns. The read and write models are different from one another.

export interface UserCommandDto {
    email: string;
    name: string;
    status?: "Employed" | "Looking" | "Retired";
}